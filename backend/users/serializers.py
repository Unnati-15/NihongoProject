# from django.contrib.auth.base_user import BaseUserManager
# from django.core.exceptions import ValidationError
# from django.core.validators import validate_email
# from django.utils.translation import gettext_lazy as _

# class CustomUserManager(BaseUserManager):
#     def email_validator(self,email):
#         try:
#             validate_email(email)
#         except ValidationError:
#             raise ValueError(_("you must provide a valid email"))
#     def create_user(self,first_name,last_name,email,role,password):
#         if not first_name:
#             raise ValueError(_("users must submit first name"))
#         if not last_name:
#             raise ValueError(_("users must submit last name"))
#         if email:
#             email=self.normalize_email(email)
#             self.email_validator(email)
#         else:
#             raise ValueError(_("Base User and email address is required"))
        

#         user = self.model(first_name=first_name,)


from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user