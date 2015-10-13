from json import JSONEncoder
import datetime

from google.appengine.api import users
from django.shortcuts import render

from django.http import HttpResponseRedirect

secure_views = ['list',
		'entry',
		'add_message',
		'get_all_messages'
		]

class MessageEncoder(JSONEncoder):
        def default(self,o):
                if isinstance(o,datetime.datetime):
                        return str(o)
                else:
                        return o


class CustomAuthenticationForGAEMiddleWare:
	def process_view(self,request, view_func, view_args, view_kwargs):
		 if view_func.__name__ in secure_views:
			if users.get_current_user() is None:
				return render(request,'diary/oops.html',
                			{
                 			 'login_url' : users.CreateLoginURL(dest_url='/diary/')
                			})


def get_user_logged_in():
        user = users.get_current_user()

        if user:
                return user.nickname()
        else:
                return "Guest"

