from django.conf.urls import include,url

from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import logout

from . import views

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'^home/$',views.index,name='index'),
    url(r'^about/$',views.about,name='about'),
    url(r'^entry/$',views.entry,name='entry'),
    url(r'^list/$', views.list, name='list'),
    url(r'^oops/$', views.oops, name='oops'),
    url(r'^error/$', views.error, name='error'),
    url(r'^add_message/$', views.add_message, name='add_message'),
    url(r'^list/get_messages/(.*)/$', views.get_all_messages, name='get_messages'),
]
