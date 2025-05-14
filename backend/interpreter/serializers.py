from rest_framework import serializers
from .models import Availability, Certification, InterpreterCertification, InterpreterLanguage, Language,  User,Interpreter
from users.serializers import UserSerializer
from interpreter.models import Notification

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
        user_data = validated_data.pop('user')
        languages_data = validated_data.pop('language', [])
        certifications_data = validated_data.pop('certification', [])
        availability_data = validated_data.pop('availability', [])

        user = User.objects.create_user(**user_data)
        interpreter = Interpreter.objects.create(user=user, **validated_data)

        # Save languages
        for lang in languages_data:
            lang_name = lang['language']['name']
            lang_obj = Language.objects.get(name=lang_name)
            InterpreterLanguage.objects.create(interpreter=interpreter, language=lang_obj)

        # Save certifications
        for cert in certifications_data:
            cert_info = cert['certification']
            cert_obj, _ = Certification.objects.get_or_create(
                name=cert_info['name'],
                issuing_organization=cert_info['issuing_organization'],
                issue_date=cert_info['issue_date'],
                expiry_date=cert_info['expiry_date'],
            )
            InterpreterCertification.objects.create(interpreter=interpreter, certification=cert_obj)

        # Save availability
        for avail in availability_data:
            Availability.objects.create(interpreter=interpreter, **avail)

        return interpreter
    def patch(self, instance, validated_data):
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

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'created_at']