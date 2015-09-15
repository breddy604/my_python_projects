
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse


from datetime import datetime
import json

from models import DayAndUser
from models import Message

from google.appengine.ext import ndb
from google.appengine.api import users

from mysite.utils import MessageEncoder
from mysite import utils

def index(request):
    	print users.CreateLogoutURL(dest_url='/polls/')
	print users.CreateLoginURL(dest_url='/polls/')
	return render(request,'polls/index.html',
		{'login_user' : utils.get_user_logged_in(),
		 'login_url' : users.CreateLoginURL(dest_url='/polls/'),
		 'logout_url' : users.CreateLogoutURL(dest_url='/polls/')
		})

def about(request):
    return render(request,'polls/about.html',
                {
		 'login_user' : utils.get_user_logged_in(),
                 'login_url' : users.CreateLoginURL(dest_url='/polls/')
                })

def oops(request):
    return render(request,'polls/login.html',
                {
                 'login_url' : users.CreateLoginURL(dest_url='/polls/')
                })

def list(request):
    return render(request,'polls/list.html')

def entry(request):
    return render(request,'polls/entry.html')

@csrf_exempt
def add_message(request):
        b =  json.loads(request.body)
        raw_date_submit = datetime.utcnow()
        date_submit = raw_date_submit.date()
	c_user = users.get_current_user().nickname();

	day_key = ndb.Key(DayAndUser, c_user + str(date_submit))
	
	if day_key :
		du = DayAndUser(user=c_user, day=date_submit, id=c_user+str(date_submit))
		du.put()
		day_key = ndb.Key(DayAndUser, c_user + str(date_submit))
	
	me = Message(parent=day_key,time=raw_date_submit, content=b['content'])
	me.put()	

        return HttpResponse(json.dumps([{'email_id' : c_user , 'date_happened' : str(date_submit) , 'time' : str(raw_date_submit) , 'content' : b['content']}]))


def get_all_messages(request,g_date):
	user = users.get_current_user().nickname()

	day_user_key = ndb.Key(DayAndUser,user+str(datetime.strptime(g_date,'%a %b %d %Y').date()))
        messages = Message.query_messages(day_user_key).fetch()
	messages_json = [message.to_dict() for message in messages]
	

	return HttpResponse(json.dumps(messages_json,cls=MessageEncoder))


