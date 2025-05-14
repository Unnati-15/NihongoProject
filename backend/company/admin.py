from django.contrib import admin
from company.models import Booking, Company, JobPosting

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id','user','phone_number','address','about')
    search_fields = ['phone_number']
    list_filter = ['phone_number']
admin.site.register(Company,CompanyAdmin)

class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_title', 'company', 'language_needed', 'location', 'date_time', 'status', 'posted_at')
    search_fields = ['job_title', 'company__user__username', 'language_needed', 'location']
    list_filter = ['status', 'language_needed', 'date_time']
admin.site.register(JobPosting, JobPostingAdmin)


class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_posting', 'interpreter', 'status', 'created_at')
    search_fields = ['job_posting__job_title', 'interpreter__user__username']
    list_filter = ['status', 'created_at']
admin.site.register(Booking, BookingAdmin)