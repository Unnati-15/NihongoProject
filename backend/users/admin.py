from django.contrib import admin
from .models import User

# Registering the User model (if you are using the default User admin interface)
admin.site.register(User)