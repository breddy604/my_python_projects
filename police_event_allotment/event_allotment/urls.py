from django.conf.urls import include,url

from . import views


urlpatterns = [
url(r'^$',views.index,name='index'),
url(r'^event_page$',views.event_page,name='event_page'),
url(r'^passport$',views.passport,name='passport'),
url(r'^about$',views.about,name='about'),
url(r'^add_event$',views.add_event,name='add_event'),
url(r'^add_participant$',views.add_participant,name='add_participant'),
url(r'^add_ppoint$',views.add_ppoint,name='add_ppoint'),
url(r'^get_all_events$',views.get_all_events,name='get_all_events'),
url(r'^get_all_ppoints/(.*)$',views.get_all_ppoints,name='get_all_ppoints'),
url(r'^get_all_force/(.*)$',views.get_all_force,name='get_all_force'),
url(r'^get_free_force/(.*)/(.*)$',views.get_free_force,name='get_free_force'),
url(r'^view_all_ppoints$',views.view_all_ppoints,name='view_all_ppoints'),
url(r'^view_all_force$',views.view_all_force,name='view_all_force'),
url(r'^view_all_events/(.*)$',views.view_all_events,name='view_all_events'),
url(r'^dispatch_force/(.*)/(.*)/(.*)$',views.dispatch_force,name='dispatch_force'),
url(r'^view_dispatch_force_page$',views.view_dispatch_force_page,name='view_dispatch_force_page'),
url(r'^allot_force$',views.allot_force,name='allot_force'),
url(r'^allot_pp$',views.allot_pp,name='allot_pp'),
url(r'^get_event_name/(.*)$',views.get_event_name,name='get_event_name'),
url(r'^get_point_name/(.*)$',views.get_point_name,name='get_point_name'),
url(r'^get_allotted_pc/(.*)/(.*)$',views.get_allotted_pc,name='get_allotted_pc'),
]