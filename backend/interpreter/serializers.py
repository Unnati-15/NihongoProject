from rest_framework import serializers
from .models import Availability, Certification, InterpreterCertification, InterpreterLanguage, Language, User,Interpreter
from users.serializers import UserSerializer

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id','name']

class InterpreterLanguageSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()
    class Meta:
        model = InterpreterLanguage
        fields = ['language']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id','name','issuing_organization','issue_date','expiry_date']

class InterpreterCertificationSerializer(serializers.ModelSerializer):
    certification = CertificationSerializer()
    class Meta:
        model = InterpreterCertification
        fields = ['certification']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id','day_of_week','start_time','end_time']

class InterpreterSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    language = InterpreterLanguageSerializer(many=True,read_only=True)
    certification = InterpreterCertificationSerializer(many=True,read_only=True)
    availability = AvailabilitySerializer(many=True,read_only=True)

    class Meta:
        model = Interpreter
        fields = ['id', 'user', 'phone_number', 'address', 'bio', 'date_of_birth', 'language', 'certification', 'availability']

    def create(self, validated_data):
        # Extract user data
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)

        # Create Interpreter instance
        interpreter = Interpreter.objects.create(user=user, phone_number=validated_data['phone_number'], 
                                                 address=validated_data['address'], bio=validated_data['bio'],
                                                 date_of_birth=validated_data['date_of_birth'])

        # Handle many-to-many relationships (languages)
        languages_data = validated_data.pop('language', [])
        for language_data in languages_data:
            # Retrieve the Language instance from the database
            language_name = language_data['language']['name']
            language_instance = Language.objects.get(name=language_name)
            InterpreterLanguage.objects.create(interpreter=interpreter, language=language_instance)

        # Handle many-to-many relationships (certifications)
        certifications_data = validated_data.pop('certification', [])
        for certification_data in certifications_data:
            # Retrieve the Certification instance from the database
            certification_name = certification_data['certification']['name']
            issuing_organization = certification_data['certification']['issuing_organization']
            issue_date = certification_data['certification']['issue_date']
            expiry_date = certification_data['certification']['expiry_date']
            
            certification_instance, created = Certification.objects.get_or_create(
                name=certification_name,
                issuing_organization=issuing_organization,
                issue_date=issue_date,
                expiry_date=expiry_date
            )

            InterpreterCertification.objects.create(interpreter=interpreter, certification=certification_instance)

        # Handle one-to-many relationships (availability)
        availability_data = validated_data.pop('availability', [])
        for availability in availability_data:
            Availability.objects.create(interpreter=interpreter, **availability)

        return interpreter
    def update(self, instance, validated_data):
        # Extract nested user data from the validated data
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            # Update fields of the related User model
            for field, value in user_data.items():
                setattr(user_instance, field, value)
            user_instance.save()

        # Update fields of the Interpreter model
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        return instance