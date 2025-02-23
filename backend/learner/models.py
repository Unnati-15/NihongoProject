from django.db import models
from users.models import User
# Create your models here.
class Learner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="learner_account")
    class SkillLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        ADVANCED = 'advanced', 'Advanced'

    skill_level = models.CharField(
        max_length=10,
        choices=SkillLevel.choices,  
    )