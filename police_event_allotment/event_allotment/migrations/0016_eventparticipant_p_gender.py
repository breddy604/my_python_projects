# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-07-16 09:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_allotment', '0015_auto_20160712_0431'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventparticipant',
            name='p_gender',
            field=models.CharField(default='M', max_length=2),
            preserve_default=False,
        ),
    ]
