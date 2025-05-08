from django.db import models
from users.models import User
# Create your models here.
class Interpreter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="interpreter_account")
    phone_number = models.IntegerField()
    address = models.TextField()
    bio = models.TextField()
    date_of_birth = models.DateField()
    def __str__(self):
        return f"{self.user.username} - Interpreter"

class Language(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class InterpreterLanguage(models.Model):
    interpreter = models.ForeignKey(Interpreter, related_name="language",on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)

class Certification(models.Model):
    name = models.CharField(max_length=100)
    issuing_organization = models.CharField(max_length=100)
    issue_date = models.DateField()
    expiry_date = models.DateField()
    def __str__(self):
        return f"{self.name} - {self.issuing_organization}"

class InterpreterCertification(models.Model):
    interpreter = models.ForeignKey(Interpreter, related_name="certification",on_delete=models.CASCADE)
    certification = models.ForeignKey(Certification, on_delete=models.CASCADE)

class Availability(models.Model):
    interpreter = models.ForeignKey(Interpreter, related_name="availability",on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=20)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    def __str__(self):
        return f"{self.day_of_week} - {self.start_time} to {self.end_time}"
    