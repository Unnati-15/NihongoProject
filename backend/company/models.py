from django.db import models
from interpreter.models import Interpreter
from users.models import User

class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="company_account")
    phone_number = models.IntegerField()
    address = models.TextField()
    about = models.TextField()
    def __str__(self):
        return self.user.username
    
class JobPosting(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="job_postings")
    job_title = models.CharField(max_length=255)
    description = models.TextField()
    language_needed = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('closed', 'Closed')], default='open')
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title
    

class Booking(models.Model):
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name="bookings")
    interpreter = models.ForeignKey(Interpreter, on_delete=models.CASCADE, related_name="bookings")

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job_posting', 'interpreter')

    def __str__(self):
        return f"{self.job_posting.job_title} -> {self.interpreter.user.username} ({self.status})"
