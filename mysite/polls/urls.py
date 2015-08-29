from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^list/$', views.list, name='list'),
    url(r'^add_message/$', views.add_message, name='add_message'),
    url(r'^list/get_messages/$', views.get_all_messages, name='get_messages'),
]
