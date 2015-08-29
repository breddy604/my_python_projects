from cassandra.cqlengine.management import sync_table

from cassandra.util import uuid_from_time
from cassandra.util import unix_time_from_uuid1


from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render

import json
import jsonpickle
import time

from datetime import datetime

from mysite.DBConnection import DBConnection
from mysite.utils import MessageEncoder

# Create your views here.

db_connection = DBConnection()	


def index(request):
    return render(request,'polls/index.html')

def list(request):
    return render(request,'polls/list.html')

@csrf_exempt
def add_message(request):
	print db_connection
	b =  json.loads(request.body)
	raw_date_submit = datetime.utcnow()
	date_submit = raw_date_submit.date()
	uuid_time = uuid_from_time(raw_date_submit)
	
	bind_values = ['babandi@cisco.com',date_submit,uuid_time,b['content']]
	db_connection.bind_and_execute_stmt('INSERT',bind_values)

	return HttpResponse(json.dumps([{'email_id' : 'babandi@cisco.com' , 'date_happened' : date_submit.isoformat() , 'event_time' : unix_time_from_uuid1(uuid_time) , 'content' : b['content']}]))

def get_all_messages(request):
	bind_values = ['babandi@cisco.com','2015-08-29']
	values = db_connection.bind_and_execute_stmt('SELECT_RANGE',bind_values)
	return HttpResponse(json.dumps(values,cls=MessageEncoder))
		
