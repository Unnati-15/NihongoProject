from rest_framework import serializers
from company.models import Booking, Company, JobPosting
from interpreter.models import Availability
from interpreter.serializers import InterpreterSerializer
from users.models import User
from users.serializers import UserSerializer


class CompanySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Company
        fields = ['id','user','phone_number','address','about']

    def create(self, validated_data):
        # Get user data
        user_data = validated_data.pop('user', None)
        
        # If user data is provided, create the user
        if user_data:
            user = User.objects.create_user(**user_data)  # Assuming the user data includes necessary fields
        else:
            raise serializers.ValidationError('User data is required to create a Learner.')

        # Now create the Learner object with the newly created user
        company = Company.objects.create(user=user, **validated_data)
        return company

class JobPostingSerializer(serializers.ModelSerializer): 
    class Meta:
        model = JobPosting
        fields = ['id', 'job_title', 'description', 'language_needed', 'location', 'date_time', 'status', 'posted_at']    
    
class BookingSerializer(serializers.ModelSerializer):
    job_posting = JobPostingSerializer(read_only=True)
    interpreter = InterpreterSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['created_at']

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['job_posting', 'interpreter', 'notes']

    def validate(self, data):
    # Get the job_posting either from data or instance
        job_posting = data.get('job_posting') or getattr(self.instance, 'job_posting', None)
        interpreter = data.get('interpreter') or getattr(self.instance, 'interpreter', None)

        if job_posting and interpreter:
            job_time = job_posting.date_time
            available_slots = Availability.objects.filter(interpreter=interpreter)

            if not any(slot.start_time <= job_time <= slot.end_time for slot in available_slots):
                raise serializers.ValidationError("Interpreter is not available at the job time.")
    
        return data