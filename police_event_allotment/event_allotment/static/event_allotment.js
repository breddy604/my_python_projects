var ERROR_PAGE_FLAG = "Something went wrong";

var ea = angular.module("event_allotment", ['ngRoute']).config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

ea.config(function($routeProvider) {
    $routeProvider
        .when('/event_page', {
            templateUrl: '/event_page',
            controller: 'eventAllotmentController'
        })
        .when('/login_page', {
            templateUrl: '/login_page',
            controller: 'eventAllotmentController'
        })
        .when('/edit_event', {
            templateUrl: '/event_page',
            controller: 'eventAllotmentController'
        })
        .when('/list_events', {
            templateUrl: '/list_events',
            controller: 'eventAllotmentController'
        })
        .when('/home', {
            templateUrl: '/home',
            controller: 'eventAllotmentController'
        })
        .when('/add_ps_page', {
            templateUrl: '/add_ps_page',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_events/addPPoint', {
            templateUrl: '/view_all_events/addPPoint',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_events/viewPPoint', {
            templateUrl: '/view_all_events/viewPPoint',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_events/allotForce', {
            templateUrl: '/view_all_events/allotForce',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_events/viewForce', {
            templateUrl: '/view_all_events/viewForce',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_events/dispatchForce', {
            templateUrl: '/view_all_events/dispatchForce',
            controller: 'eventAllotmentController'
        })
        .when('/allot_force/:p_event_id', {
            templateUrl: '/allot_force',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_ppoints/:p_event_id', {
            templateUrl: '/view_all_ppoints',
            controller: 'eventAllotmentController'
        })
        .when('/allot_pp/:p_event_id', {
            templateUrl: '/allot_pp',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_force/:p_event_id', {
            templateUrl: '/view_all_force',
            controller: 'eventAllotmentController'
        })
        .when('/view_dispatch_force_page/:event_id/:point_id/', {
            templateUrl: '/view_dispatch_force_page',
            controller: 'eventAllotmentController'
        })
        .when('/passport/:event_id/:point_id/', {
            templateUrl: '/passport',
            controller: 'eventAllotmentController'
        })
        .when('/passport/:event_id/:point_id/:person_id/', {
            templateUrl: '/passport',
            controller: 'eventAllotmentController'
        })
        .when('/report_sector_wise/:event_id', {
            templateUrl: '/report_sector_wise',
            controller: 'eventAllotmentController'
        })
        .when('/force_by_station/:event_id', {
            templateUrl: '/force_by_station',
            controller: 'eventAllotmentController'
        })
        .otherwise({ templateUrl: '/about' });
});

ea.controller("globalController", function($scope) {

});

ea.controller("eventAllotmentController", function($scope, eventAllotmentStorage, Event, Participant, PicketPoint, $routeParams, $window) {

    $scope.addEvent = function() {
        console.log("Add Event clicked " + $scope.event.name);
        if ($scope.event) {
            $scope.event.event_end_date = document.getElementById("event_end_date").value;
            $scope.event.event_start_date = document.getElementById("event_start_date").value;
            $scope.response = {};
            if ($scope.event.id) {
                var new_event = new Event($scope.event);
                eventAllotmentStorage.saveObject(new_event, "/update_event/" + $scope.event.id + '/', $scope.response);
            } else {
                $scope.event = new Event($scope.event);
                eventAllotmentStorage.saveObject($scope.event, "/add_event", $scope.response);
                $scope.event = undefined;
            }
        }
    };

    $scope.getEventIfExists = function() {

        console.log("Event Id " + $scope.event_id);
        if ($scope.event_id) {
            eventAllotmentStorage.get_object("/get_event/" + $scope.event_id).then(
                function(result) {
                    $scope.event = angular.fromJson(result);
                }
            );
        }
    };

    $scope.login = function() {
        $scope.response = {};

        eventAllotmentStorage.login($scope.user, "/login").then(
            function(result) {
                if (result == 'success') {
                    $scope.response.response = result;
                    $window.location.href = '/';
                }
            }
        );
    };

    $scope.setEventName = function() {

        eventAllotmentStorage.get_object("/get_event_name/" + $routeParams.event_id).then(
            function(result) {
                $scope.page_event_name = result;
            }
        );
    };

    $scope.setPointName = function() {

        eventAllotmentStorage.get_object("/get_point_name/" + $routeParams.point_id).then(
            function(result) {
                $scope.page_point_name = result;
            }
        );
    };

    $scope.addParticipant = function() {
        console.log("Add Participant clicked ");

        console.log("PARAM " + $routeParams.p_event_id);
        if ($scope.person) {
            $scope.person.p_event_id = $routeParams.p_event_id;
            $scope.response = {};
            $scope.person = new Participant($scope.person);
            eventAllotmentStorage.saveObject($scope.person, "/add_participant", $scope.response);
            $scope.person = undefined;
        }
    };

    $scope.addPoliceStation = function() {
        console.log("Add PS clicked ");

        if ($scope.station_name) {
            $scope.response = {};
            eventAllotmentStorage.saveObject($scope.station_name, "/add_ps/", $scope.response);
            $scope.station_name = "";
        }
    };

    $scope.deleteParticipant = function(toBeDeleted, pos) {
        console.log("Delete Participant clicked " + toBeDeleted);

        eventAllotmentStorage.deleteObject("", "/delete_participant/" + toBeDeleted + "/", $scope.response).then(
            function(result) {
                $scope.all_force.splice(pos, 1);
                $window.location.reload();
            });
    };

    $scope.deletePoint = function(toBeDeleted, pos) {
        console.log("Delete Participant clicked " + toBeDeleted);

        eventAllotmentStorage.deleteObject("", "/delete_ppoint/" + toBeDeleted + "/", $scope.response).then(
            function(result) {
                $scope.all_ppoints.splice(pos, 1);
                $window.location.reload();
            });
    };

    $scope.deleteEvent = function(toBeDeleted, pos) {
        console.log("Delete Participant clicked " + toBeDeleted);

        eventAllotmentStorage.deleteObject("", "/delete_event/" + toBeDeleted + "/", $scope.response).then(
            function(result) {
                $scope.all_events.splice(pos, 1);
                $window.location.reload();
            });
    };

    $scope.dispatchForce = function() {
        console.log("Add dispatchForce clicked ");

        if ($scope.all_force) {
            $scope.response = {};
            eventAllotmentStorage.saveObject($scope.all_force, "/dispatch_force/" +
                $routeParams.event_id + "/" + $routeParams.point_id,
                $scope.response);
        }
    };

    $scope.addPPoint = function() {
        console.log("dispatchForce clicked ");

        if ($scope.pp) {
            $scope.pp.ep_event_id = $routeParams.p_event_id;
            $scope.response = {};
            $scope.pp = new PicketPoint($scope.pp);
            eventAllotmentStorage.saveObject($scope.pp, "/add_ppoint", $scope.response);
            $scope.pp = undefined;
        }
    };

    $scope.callPPoints = function() {
        console.log("Get All PPoints clicked");
        eventAllotmentStorage.get_all_objects('/get_all_ppoints/' + $routeParams.p_event_id).then(
            function(result) {
                $scope.all_ppoints = result;
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    };

    $scope.loadStations = function() {
        console.log("Get All Stations clicked");
        eventAllotmentStorage.get_all_objects('/get_all_ps/').then(
            function(result) {
                $scope.all_ps = result;
            },
            function(result) {
                console.log("Error in getting all ps");
            }

        );
    };

    $scope.callGetForce = function() {
        console.log("Get All Force clicked");
        eventAllotmentStorage.get_all_objects('/get_all_force/' + $routeParams.p_event_id).then(
            function(result) {
                $scope.all_force = sort_by_rank(result);
                $scope.summary = { 'DSP': 0, 'CI': 0, 'SI': 0, 'WSI': 0, 'ASI': 0, 'WASI': 0, 'HC': 0, 'WHC': 0, 'PC': 0, 'WPC': 0, 'HG': 0, 'WHG': 0 };
                for (p in $scope.all_force) {
                    $scope.summary[$scope.all_force[p].p_designation] = $scope.summary[$scope.all_force[p].p_designation] + 1;
                }

            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    };

    $scope.getDataForPassport = function() {
        console.log("Get passport clicked");
        eventAllotmentStorage.get_object('/get_data_for_passport/' + $routeParams.event_id + '/' + $routeParams.point_id + '/' + $routeParams.person_id).then(
            function(result) {
                $scope.passport_data = result;
                $scope.force = sort_by_rank(angular.fromJson(result['force']));
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    }

    $scope.get_force_by_sector = function() {
        eventAllotmentStorage.get_object('/get_force_by_sector/' + $routeParams.event_id).then(
            function(result) {
                $scope.force_by_sector = result;
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    }

    $scope.get_force_by_station = function() {
        eventAllotmentStorage.get_object('/get_force_by_station/' + $routeParams.event_id).then(
            function(result) {
                $scope.force_by_station = result;
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    }

    $scope.getAllPCForce = function() {
        console.log("Get Alllotted PC clicked");
        eventAllotmentStorage.get_all_objects('/get_allotted_pc/' + $routeParams.event_id + '/' + $routeParams.point_id).then(
            function(result) {
                $scope.all_pc_force = result;
                $scope.no_of_pcs = result.length
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    };



    $scope.callGetFreeForce = function() {
        console.log("Get All Force clicked");
        $scope.point_id = $routeParams.point_id;
        eventAllotmentStorage.get_all_objects('/get_free_force/' + $routeParams.event_id + '/' + $routeParams.point_id).then(
            function(result) {
                $scope.all_force = sort_by_rank(result);
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    };

    function sort_by_rank(result) {
        var force_by_rank = { 'DSP': [], 'CI': [], 'SI': [], 'WSI': [], 'ASI': [], 'WASI': [], 'HC': [], 'WHC': [], 'PC': [], 'WPC': [], 'HG': [], 'WHG': [] }

        for (f in result) {
            force_by_rank[result[f].p_designation].push(result[f]);
        }

        var to_return = [];
        for (f in force_by_rank) {
            to_return = to_return.concat(force_by_rank[f]);
        }

        return to_return;
    }

    $scope.get_all_events = function() {
        console.log("Get All events clicked");
        eventAllotmentStorage.get_all_objects('/get_all_events').then(
            function(result) {
                $scope.all_events = result;
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    }
});

ea.service("eventAllotmentStorage", function($http, $window) {
    this.saveObject = function(object, post_url, response_obj) {
        $http.post(post_url, object, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            function(response) {
                response_obj.response = "success";
                response_obj.pk = response.data;
            },
            function(response) {
                response_obj.response = "failure";
            }
        );
    };

    this.deleteObject = function(object, post_url, response_obj) {
        return $http.post(post_url, object, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.get_all_objects = function(get_url) {
        return $http.get(get_url).then(
            function(response) {
                return response.data.map(function(d) {
                    var tmp_case = angular.fromJson(d);
                    return tmp_case;
                });
            }
        );
    }

    this.login = function(object, post_url) {
        return $http.post(post_url, object, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            function(response) {
                return response.data
            });
    };

    this.get_object = function(get_url) {
        return $http.get(get_url).then(
            function(response) {
                return response.data
            });
    };

});

ea.factory("Event", function getEventClass() {
    function Event(defaults) {
        console.log("Creating Event " + defaults.event_name)
        this.event_name = defaults.event_name;
        this.event_place = defaults.event_place;
        this.event_start_date = defaults.event_start_date;
        this.event_end_date = defaults.event_end_date;
        this.event_owner_branch = defaults.event_owner_branch;
        this.event_owner_district = defaults.event_owner_district;
        this.event_owner = defaults.event_owner;
    };
    return Event;
});

ea.factory("PicketPoint", function getPPClass() {
    function PicketPoint(defaults) {
        this.ep_name = defaults.ep_name;
        this.ep_event_id = defaults.ep_event_id;
        this.ep_sector = defaults.ep_sector;
    };
    return PicketPoint;
});

ea.factory("Participant", function getParticipantClass() {
    function Participant(defaults) {
        this.p_name = defaults.p_name;
        this.p_code = defaults.p_code;
        this.p_designation = defaults.p_designation;
        this.p_contact = defaults.p_contact;
        this.p_ps = defaults.p_ps.station_name;
        this.p_event_id = defaults.p_event_id;
    };
    return Participant;
});