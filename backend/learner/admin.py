from django.contrib import admin

from learner.models import Learner

# Register your models here.
class LearnerAdmin(admin.ModelAdmin):
    list_display = ('id','user','skill_level')
    search_fields = ['skill_level']
    list_filter = ['skill_level']
admin.site.register(Learner,LearnerAdmin)