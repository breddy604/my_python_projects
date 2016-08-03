from django.shortcuts import render, HttpResponseRedirect

from django.contrib.auth.models import User, Group

secure_views = ['event_page',
		'passport',
		'view_all_events',
		'list_events',
        'manage_event',
        'allot_force',
        'allot_pp',
        'view_all_ppoints',
        'view_all_force',
        'view_dispatch_force_page',
        'add_event',
        'get_event',
        'update_event',
        'add_participant',
        'add_ppoint',
        'dispatch_force',
        'create_event',
        'create_participant',
        'create_ppoint',
        'get_point_name',
        'get_event_name',
        'get_all_events',
        'get_all_force',
        'get_data_for_passport',
		]

admin_only_views = ['event_page',
                'allot_pp',
                'view_dispatch_force_page',
                'add_event',
                'update_event',
                'add_ppoint',
                'dispatch_force',
                'create_event',
                'create_ppoint',
                ]

class CustomAuthenticationForPDMSMiddleWare:
	def process_view(self, request, view_func, view_args, view_kwargs):
		print view_func.__name__
		if view_func.__name__ in secure_views:
                        print 'Authenticated' , request.user
			if not request.user.is_authenticated():
				return render(request,'temp_login.html')

                if view_func.__name__ in admin_only_views:
                        if not request.user.groups.filter(name='admin_only').exists():
                                return render(request, 'not_permit.html')

