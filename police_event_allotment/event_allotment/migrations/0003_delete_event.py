# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-06-09 04:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event_allotment', '0002_auto_20160609_0416'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Event',
        ),
    ]
