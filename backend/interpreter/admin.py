from django.contrib import admin
from .models import Interpreter, Language, InterpreterLanguage, Certification, InterpreterCertification

# Inline class for associating languages with interpreters
class InterpreterLanguageInline(admin.TabularInline):
    model = InterpreterLanguage
    extra = 1

# Admin class for the Interpreter model
class InterpreterAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone_number','address','bio', 'date_of_birth')
    search_fields = ['phone_number']
    list_filter = ['date_of_birth']
    inlines = [InterpreterLanguageInline]  # Add the inline for languages

# Register Interpreter model with the admin panel
admin.site.register(Interpreter, InterpreterAdmin)

# Admin class for the Language model
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']

# Register Language model with the admin panel
admin.site.register(Language, LanguageAdmin)

# Inline class for associating certifications with interpreters
class InterpreterCertificationInline(admin.TabularInline):
    model = InterpreterCertification
    extra = 1

# Admin class for the Certification model
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'issuing_organization', 'issue_date', 'expiry_date')
    search_fields = ['name', 'issuing_organization']
    inlines = [InterpreterCertificationInline]  # Add the inline for certifications

# Register Certification model with the admin panel
admin.site.register(Certification, CertificationAdmin)
