from django.db import models

# Create your models here.

from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model

import json

class MessageContent(Model):
	email_id = columns.Text(partition_key = True)
	date_happened = columns.Date(partition_key = True)
	event_time = columns.UUID(primary_key=True)
	content = columns.Text()

