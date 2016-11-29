from django.shortcuts import render, HttpResponseRedirect

from django.http import HttpResponse
from django.core import serializers
from django.forms.models import model_to_dict

from django.db.models import Q

from models import PoliceEvent,EventParticipant,EventPicketPoint

from django.contrib.auth.decorators import login_required

from django.contrib.auth import authenticate

from django.contrib import auth

import json, time, collections

# Create your views here.

def index(request):
	return render(request,'index.html',  {'loggedin_user' : request.user})

def about(request):
    return render(request,'about.html')

def event_page(request):
	return render(request,'event_page.html')

def passport(request):
    return render(request,'passport.html')

def login_page(request):
    return render(request,'login.html')

def report_sector_wise(request):
    return render(request, 'report_sector_wise.html')

def force_by_station(request):
    return render(request, 'force_by_station.html')  

def view_all_events(request, source):
    if source == 'viewForce' :
        return render(request,'view_all_events.html' , {'p_title' : 'View All Force Allocated', 'p_next_url' : 'view_all_force'})

    if source == 'allotForce' :
        return render(request,'view_all_events.html' , {'p_title' : 'Allocate Force', 'p_next_url' : 'allot_force'})

    if source == 'addPPoint' :
        return render(request,'view_all_events.html' , {'p_title' : 'Add Picket Points', 'p_next_url' : 'allot_pp'})

    if source == 'viewPPoint' :
        return render(request,'view_all_events.html' , {'p_title' : 'View Picket Points', 'p_next_url' : 'view_all_ppoints'})

    if source == 'dispatchForce' :
        return render(request,'view_all_events.html' , {'p_title' : 'Dispatch Force to Points', 'p_next_url' : 'view_all_ppoints'})

def list_events(request):
    return render(request, 'list_events.html')

def home(request):
    return render(request, 'home.html')
    
def manage_event(request, event_id):
    e = PoliceEvent.objects.get(pk=event_id)
    return render(request, 'manage_event.html' , {'p_title' : e.event_name , 'p_event_id' : event_id,  'loggedin_user' : request.user})

def allot_force(request):
    return render(request,'allot_force.html')

def allot_pp(request):
    return render(request,'allot_picket_points.html')

def view_all_ppoints(request):
    return render(request, "view_all_ppoints.html")

def view_all_force(request):
    return render(request, "view_all_force.html")

def view_dispatch_force_page(request):
    return render(request,"dispatch_force_to_points.html")

def login(request):
    user_info = json.loads(request.body)
    user = authenticate(username=user_info['username'], password=user_info['password'])
    if user is not None:
        # the password verified for the user
        if user.is_active:
            auth.login(request,user)
            print "User is valid, active and authenticated" 
            return HttpResponse("success");
        else:
            print "The password is valid, but the account has been disabled!" 
    else:
        # the authentication system was unable to verify the username and password
        print("The username and password were incorrect.")
    return HttpResponse("failure");

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/#/')


def add_event(request):
    eventObject = json.loads(request.body)
    event = create_event(eventObject)
    event.save()
    return HttpResponse(event.pk)

def get_event(request, event_id):
    pe = PoliceEvent.objects.get(pk=event_id)

    return HttpResponse(json.dumps(model_to_dict(pe)))

def update_event(request,event_id):
    pe = PoliceEvent.objects.get(pk=event_id)
    input = json.loads(request.body)
    pe.event_name=input['event_name']
    pe.event_place = input['event_place']
    pe.event_start_date = input['event_start_date']
    pe.event_end_date = input['event_end_date']
    pe.event_owner = input['event_owner']
    pe.event_owner_branch = input['event_owner_branch']
    pe.event_owner_district = input['event_owner_district']
    pe.save()
    return HttpResponse(event_id)

def add_participant(request):
    p = json.loads(request.body)
    po = create_participant(p)
    po.save()
    return HttpResponse(po.pk)

def add_ppoint(request):
    p = json.loads(request.body)
    po = create_ppoint(p)
    po.save()
    return HttpResponse(po.pk)

def dispatch_force(request, event_id, point_id):
    fl = json.loads(request.body)
    for f in fl:
        f_db = EventParticipant.objects.get(pk=f['pk'])
        if(f['checked']):
            f_db.p_pp_id = point_id
            print 'setting point_id to ' , point_id
            f_db.save()
        else:
            f_db.p_pp_id = ''
            f_db.save()
    return HttpResponse("Success")

def create_event(input):
    pe = PoliceEvent(event_name=input['event_name'],
        event_place = input['event_place'],
        event_start_date = input['event_start_date'],
        event_end_date = input['event_end_date'],
        event_owner = input['event_owner'],
        event_owner_branch = input['event_owner_branch'],
        event_owner_district = input['event_owner_district']
        )
    return pe

def create_participant(input):
    pe = EventParticipant(p_name=input['p_name'],
        p_code = input['p_code'],
        p_designation = input['p_designation'],
        p_contact = input['p_contact'],
        p_ps = input['p_ps'],
        p_event_id = input['p_event_id']
        )
    return pe

def create_ppoint(input):
    epe = EventPicketPoint(ep_name=input['ep_name'],
        ep_event_id = input['ep_event_id'],
        ep_sector = input['ep_sector'],
        )
    return epe

def get_point_name(request,point_id):
    p = EventPicketPoint.objects.get(pk=point_id)
    return HttpResponse(p.ep_name)

def get_event_name(request,event_id):
    e = PoliceEvent.objects.get(pk=event_id)
    return HttpResponse(e.event_name)

def get_all_events(request):
    all_events = PoliceEvent.objects.all()
    toReturn = add_unique_results(all_events)
    return HttpResponse(json.dumps(toReturn))

def get_all_force(request,event_id):
    all_force = EventParticipant.objects.filter(p_event_id=event_id)
    toReturn = add_unique_results(all_force)
    for f in toReturn:
        if f['p_pp_id'] != '':
            p = EventPicketPoint.objects.get(pk=f['p_pp_id'])
            f['p_pp_name'] = p.ep_name

    return HttpResponse(json.dumps(toReturn))

def get_data_for_passport(request, event_id, point_id, person_id=''):
    if(person_id == 'undefined'):
        all_force = EventParticipant.objects.filter(p_pp_id = point_id , p_event_id=event_id)
    else:
        all_force = EventParticipant.objects.filter(pk= person_id)
    force_json = add_unique_results(all_force)
    toReturn = {}
    toReturn['event_name'] = PoliceEvent.objects.get(pk=event_id).event_name
    toReturn['event_owner'] = PoliceEvent.objects.get(pk=event_id).event_owner
    toReturn['event_owner_branch'] = PoliceEvent.objects.get(pk=event_id).event_owner_branch
    toReturn['event_owner_district'] = PoliceEvent.objects.get(pk=event_id).event_owner_district
    toReturn['event_start_date'] = PoliceEvent.objects.get(pk=event_id).event_start_date
    toReturn['event_end_date'] = PoliceEvent.objects.get(pk=event_id).event_end_date
    point_p = EventPicketPoint.objects.get(pk=point_id)
    toReturn['point_name'] = point_p.ep_sector + '-' + point_p.ep_name
    toReturn['force'] = force_json
    return HttpResponse(json.dumps(toReturn))


def get_force_by_sector(request, event_id):
    all_pp = EventPicketPoint.objects.filter(ep_event_id = event_id)
    to_be_returned = []
    sectors = []
    for p in all_pp:
        if p.ep_sector not in sectors:
            sectors.append(p.ep_sector)

    for sector in sectors:
        sector_object = {}
        sector_object['sector_name'] = sector
        all_pp_sector = EventPicketPoint.objects.filter(ep_sector = sector, ep_event_id = event_id)
        points = []
        for pp in all_pp_sector:
            point = {}
            point['point_name'] = pp.ep_name
            all_force_pp = EventParticipant.objects.filter(p_pp_id = pp.pk , p_event_id=event_id)
            point['force'] = sort_by_rank(add_unique_results(all_force_pp))
            points.append(point)
        sector_object['points'] = points
        to_be_returned.append(sector_object)

    return HttpResponse(json.dumps(to_be_returned, indent = 4))

            
def get_force_by_station(request, event_id):
    all_force = EventParticipant.objects.filter(p_event_id=event_id)
    force_by_ps = {}

    for force in all_force:
        tmp = {}
        if force.p_ps not in force_by_ps:
            force_by_ps[force.p_ps] = 0
        force_by_ps[force.p_ps] = force_by_ps[force.p_ps] + 1

    to_be_returned = []
    for f in force_by_ps:
        to_be_returned.append({'station_name' : f, 'count' : force_by_ps[f]})

    return HttpResponse(json.dumps(to_be_returned))



def get_free_force(request,event_id,point_id):
    all_force = EventParticipant.objects.filter((Q(p_pp_id = point_id) | Q(p_pp_id = '')), p_event_id=event_id )
    toReturn = add_unique_results(all_force)
    for t in toReturn:
        if t['p_pp_id'] !='':
            t['checked'] = True
        else:
            t['checked'] = False
    return HttpResponse(json.dumps(toReturn))

def get_allotted_pc(request,event_id,point_id):
    all_force = EventParticipant.objects.filter(Q(p_pp_id = point_id) & Q(p_designation = 'PC'), p_event_id=event_id )
    toReturn = add_unique_results(all_force)
    return HttpResponse(json.dumps(toReturn))

def get_all_ppoints(request, event_id):
    all_ppoints = EventPicketPoint.objects.filter(ep_event_id=event_id)
    toReturn = add_unique_results(all_ppoints)
    return HttpResponse(json.dumps(toReturn))

def add_unique_results(q):
    output = []
    raw_results = serializers.serialize('python',q)
    for c in raw_results:
        c['fields']['pk'] = c['pk']
        if(c['fields'] not in output):
            output.append(c['fields'])
    return output

def sort_by_rank(result):
    force_by_rank = collections.OrderedDict([('DSP' , []), ('CI', []), ('SI', []), ('WSI', []), ('ASI', []), ('WASI', []), ('HC', []), ('WHC', []), ('PC', []), ('WPC', []) ])
    
    for f in force_by_rank:
        print f

    for f in result :
        force_by_rank[f['p_designation']].append(f);
    to_return = [];
    for f in force_by_rank :
        to_return = to_return + force_by_rank[f]

    return to_return;

