from django.conf.urls import include,url

from . import views


urlpatterns = [
url(r'^$',views.index,name='index'),
url(r'^event_page$',views.event_page,name='event_page'),
url(r'^login_page$',views.login_page,name='login_page'),
url(r'^login$',views.login,name='login'),
url(r'^logout$',views.logout,name='logout'),
url(r'^get_event/(.*)$',views.get_event,name='get_event'),
url(r'^update_event/(.*)/$',views.update_event,name='update_event'),
url(r'^list_events$',views.list_events,name='list_events'),
url(r'^manage_event/(.*)/$',views.manage_event,name='manage_event'),
url(r'^passport$',views.passport,name='passport'),
url(r'^about$',views.about,name='about'),
url(r'^home$',views.home,name='home'),
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
url(r'^dispatch_force/(.*)/(.*)$',views.dispatch_force,name='dispatch_force'),
url(r'^view_dispatch_force_page$',views.view_dispatch_force_page,name='view_dispatch_force_page'),
url(r'^allot_force$',views.allot_force,name='allot_force'),
url(r'^allot_pp$',views.allot_pp,name='allot_pp'),
url(r'^get_event_name/(.*)$',views.get_event_name,name='get_event_name'),
url(r'^get_point_name/(.*)$',views.get_point_name,name='get_point_name'),
url(r'^get_allotted_pc/(.*)/(.*)$',views.get_allotted_pc,name='get_allotted_pc'),
url(r'^get_data_for_passport/(.*)/(.*)/(.*)$',views.get_data_for_passport,name='get_data_for_passport'),
url(r'^get_force_by_sector/(.*)$',views.get_force_by_sector,name='get_force_by_sector'),
url(r'^report_sector_wise',views.report_sector_wise,name='report_sector_wise'),
url(r'^get_force_by_station/(.*)',views.get_force_by_station,name='get_force_by_station'),
url(r'^force_by_station',views.force_by_station,name='force_by_station'),

]