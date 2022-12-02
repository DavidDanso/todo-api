from django.db import models
import uuid
from django.contrib.humanize.templatetags.humanize import naturaltime

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=255, null=True)
    updated_time_stamp = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-updated_time_stamp']

    @property
    def natural_time(self):
        natural_time = naturaltime(self.updated_time_stamp)
        return natural_time
    