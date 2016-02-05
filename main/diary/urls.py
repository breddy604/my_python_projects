from django.conf.urls import include,url

from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import logout

from . import views

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'^home/$',views.index,name='index'),
    url(r'^about/$',views.about,name='about'),
    url(r'^feedback/$',views.feedback,name='feedback'),
    url(r'^entry/$',views.entry,name='entry'),
    url(r'^list/$', views.list, name='list'),
#    url(r'^credits/$', views.credits, name='credits'),
    url(r'^oops/$', views.oops, name='oops'),
    url(r'^login/$', views.login, name='login'),
    url(r'^error/$', views.error, name='error'),
    url(r'^sure/$', views.sure, name='sure'),
    url(r'^edit/$', views.edit, name='edit'),
    url(r'^add_message/$', views.add_message, name='add_message'),
    url(r'^list/get_messages/(.*)/$', views.get_all_messages, name='get_messages'),
    url(r'^submit_feedback/$', views.submit_feedback, name='submit_feedback'),   
]
