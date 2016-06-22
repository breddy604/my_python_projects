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
        .when('/allot_force/:p_event_id/:page_name', {
            templateUrl: '/allot_force',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_ppoints/:p_event_id/:page_name', {
            templateUrl: '/view_all_ppoints',
            controller: 'eventAllotmentController'
        })
        .when('/allot_pp/:p_event_id/:page_name', {
            templateUrl: '/allot_pp',
            controller: 'eventAllotmentController'
        })
        .when('/view_all_force/:p_event_id/:page_name', {
            templateUrl: '/view_all_force',
            controller: 'eventAllotmentController'
        })
        .when('/view_dispatch_force_page/:event_id/:point_id/', {
            templateUrl: '/view_dispatch_force_page',
            controller: 'eventAllotmentController'
        })
        .otherwise({ templateUrl: '/about' });
});

ea.controller("eventAllotmentController", function($scope, eventAllotmentStorage, Event, Participant, PicketPoint, $routeParams) {

    $scope.getPageName = function() {
        $scope.page_name = $routeParams.page_name;
    };

    $scope.addEvent = function() {
        console.log("Add Event clicked " + $scope.event.name);
        if ($scope.event) {
            $scope.event = new Event($scope.event);
            $scope.response = {};
            eventAllotmentStorage.saveObject($scope.event, "/add_event", $scope.response);
            $scope.event = undefined;
        }
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

    $scope.dispatchForce = function() {
        console.log("Add dispatchForce clicked ");

        if ($scope.all_force) {
            $scope.response = {};
            eventAllotmentStorage.saveObject($scope.all_force, "/dispatch_force/" +
                $routeParams.event_id + "/" + $routeParams.point_id + "/" + $scope.no_of_pcs,
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

    $scope.callGetForce = function() {
        console.log("Get All Force clicked");
        eventAllotmentStorage.get_all_objects('/get_all_force/' + $routeParams.p_event_id).then(
            function(result) {
                $scope.all_force = result;
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
                $scope.all_force = result;
            },
            function(result) {
                console.log("Error in getting all events");
            }

        );
    };

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

    this.get_object = function(get_url) {
        return $http.get(get_url).then(
            function(response) {
                return response.data
            });
    };

});

ea.factory("Event", function getEventClass() {
    function Event(defaults) {
        console.log("Creating Event " + defaults.name)
        this.name = defaults.name;
        this.place = defaults.place;
        this.duration = defaults.duration;
        this.owner = defaults.owner;
    };
    return Event;
});

ea.factory("PicketPoint", function getPPClass() {
    function PicketPoint(defaults) {
        this.ep_name = defaults.ep_name;
        this.ep_event_id = defaults.ep_event_id;
    };
    return PicketPoint;
});

ea.factory("Participant", function getParticipantClass() {
    function Participant(defaults) {
        this.p_name = defaults.p_name;
        this.p_code = defaults.p_code;
        this.p_designation = defaults.p_designation;
        this.p_contact = defaults.p_contact;
        this.p_event_id = defaults.p_event_id;
    };
    return Participant;
});