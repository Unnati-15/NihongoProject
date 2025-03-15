from django.db import models
from users.models import User

class Writeapp(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    learner = models.ForeignKey(User, related_name='diary', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

