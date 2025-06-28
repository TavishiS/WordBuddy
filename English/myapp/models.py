from django.db import models
from django.contrib.auth.models import User

class Word(models.Model):
    text = models.CharField(max_length=50)
    meaning = models.TextField()
    examples = models.JSONField()  # stores list like ["I love this word", "It is used in ..."]
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.text
    
class Phrase(models.Model):
    text = models.CharField(max_length=200)
    meaning = models.TextField()
    examples = models.JSONField()
    context=models.CharField(max_length=50)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.text


class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    corrected_text = models.TextField()
    feedback = models.TextField()
    date_created = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.date_created}"
    
class UserProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    words_learned = models.PositiveIntegerField(default=0)
    phrases_practiced = models.PositiveIntegerField(default=0)
    conversations_done = models.PositiveIntegerField(default=0)
    journals_written = models.PositiveIntegerField(default=0)

    seen_words = models.ManyToManyField('Word', blank=True)
    seen_phrases = models.ManyToManyField('Phrase', blank=True)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Progress"