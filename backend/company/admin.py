from django.contrib import admin
from company.models import Company

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id','user','phone_number','address','about')
    search_fields = ['phone_number']
    list_filter = ['phone_number']
admin.site.register(Company,CompanyAdmin)
