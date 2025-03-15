from rest_framework import serializers
from writeapp.models import Writeapp
from users.models import User

class WriteappSerializer(serializers.ModelSerializer):
    learner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    class Meta:
        model = Writeapp
        fields = ['id', 'title', 'content', 'created_at', 'updated_at','learner']