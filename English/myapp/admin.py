from django.contrib import admin
from myapp.models import Word
from myapp.models import Phrase
from myapp.models import JournalEntry
from myapp.models import UserProgress

# Register your models here.
admin.site.register(Word)
admin.site.register(Phrase)
admin.site.register(JournalEntry)
admin.site.register(UserProgress)