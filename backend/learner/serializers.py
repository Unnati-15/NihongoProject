from rest_framework import serializers
from .models import User,Learner
from users.serializers import UserSerializer

class LearnerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Learner
        fields = '__all__'

    def create(self, validated_data):
        # Get user data
        user_data = validated_data.pop('user', None)
        
        # If user data is provided, create the user
        if user_data:
            user = User.objects.create_user(**user_data)  # Assuming the user data includes necessary fields
        else:
            raise serializers.ValidationError('User data is required to create a Learner.')

        # Now create the Learner object with the newly created user
        learner = Learner.objects.create(user=user, **validated_data)
        return learner