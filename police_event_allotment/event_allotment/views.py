from django.shortcuts import render

from django.http import HttpResponse
from django.core import serializers

from django.db.models import Q

from models import PoliceEvent,EventParticipant,EventPicketPoint

import json

# Create your views here.

def index(request):
	return render(request,'index.html')

def about(request):
    return render(request,'about.html')

def event_page(request):
	return render(request,'event_page.html')

def passport(request):
    return render(request,'passport.html')

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
    return render(request, 'manage_event.html' , {'p_title' : e.event_name , 'p_event_id' : event_id})

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



def add_event(request):
    eventObject = json.loads(request.body)
    event = create_event(eventObject)
    event.save()
    return HttpResponse(event.pk)

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
    pe = PoliceEvent(event_name=input['name'],
        event_place = input['place'],
        event_start_date = input['start_date'],
        event_end_date = input['end_date'],
        event_owner = input['owner'],
        event_owner_branch = input['owner_branch'],
        event_owner_district = input['owner_district']
        )
    return pe

def create_participant(input):
    pe = EventParticipant(p_name=input['p_name'],
        p_code = input['p_code'],
        p_designation = input['p_designation'],
        p_contact = input['p_contact'],
        p_gender = input['p_gender'],
        p_event_id = input['p_event_id']
        )
    return pe

def create_ppoint(input):
    epe = EventPicketPoint(ep_name=input['ep_name'],
        ep_event_id = input['ep_event_id']
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
            f['p_pp_id'] = p.ep_name

    return HttpResponse(json.dumps(toReturn))

def get_data_for_passport(request, event_id, point_id):
    all_force = EventParticipant.objects.filter(p_pp_id = point_id , p_event_id=event_id)
    force_json = add_unique_results(all_force)
    toReturn = {}
    toReturn['event_name'] = PoliceEvent.objects.get(pk=event_id).event_name
    toReturn['event_owner'] = PoliceEvent.objects.get(pk=event_id).event_owner
    toReturn['event_owner_branch'] = PoliceEvent.objects.get(pk=event_id).event_owner_branch
    toReturn['event_owner_district'] = PoliceEvent.objects.get(pk=event_id).event_owner_district
    toReturn['event_start_date'] = PoliceEvent.objects.get(pk=event_id).event_start_date
    toReturn['event_end_date'] = PoliceEvent.objects.get(pk=event_id).event_end_date
    toReturn['point_name'] = EventPicketPoint.objects.get(pk=point_id).ep_name
    toReturn['force'] = force_json
    return HttpResponse(json.dumps(toReturn))


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
