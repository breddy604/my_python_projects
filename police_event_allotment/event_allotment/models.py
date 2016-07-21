from django.db import models

class PoliceEvent(models.Model):
    event_name = models.CharField(max_length=200)
    event_place = models.CharField(max_length=200)
    event_start_date = models.CharField(max_length=200)
    event_end_date = models.CharField(max_length=200)
    event_owner= models.CharField(max_length=200)
    event_owner_branch = models.CharField(max_length=200)
    event_owner_district = models.CharField(max_length=200)

class EventParticipant(models.Model):
	p_name = models.CharField(max_length=200)
	p_code = models.CharField(max_length=200)
	p_designation = models.CharField(max_length=200)
	p_ps = models.CharField(max_length=30)
	p_contact = models.CharField(max_length=200)
	p_event_id = models.CharField(max_length=200)
	p_pp_id = models.CharField(max_length=200)

class EventPicketPoint(models.Model):
	ep_name = models.CharField(max_length=200)
	ep_event_id = models.CharField(max_length=200)


