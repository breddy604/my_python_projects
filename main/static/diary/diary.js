var ERROR_PAGE_FLAG = "Something went wrong";

var selfChat = angular.module("selfChat", ['pikaday','ngRoute']).config(function($interpolateProvider,$httpProvider){
                        $interpolateProvider.startSymbol('{$');
                        $interpolateProvider.endSymbol('$}');
			$httpProvider.defaults.xsrfCookieName = 'csrftoken';
			$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
                        });

    selfChat.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : '/diary/about/',
                controller  : 'chatController'
            })
            .when('/entry', {
                templateUrl : '/diary/entry/',
                controller  : 'chatController'
            })
            .when('/oops', {
                templateUrl : '/diary/oops/',
                controller  : 'chatController'
            })
            .when('/credits', {
                templateUrl : '/diary/credits/',
                controller  : 'chatController'
            })
            .when('/error', {
                templateUrl : '/diary/error/',
                controller  : 'chatController'
            })
            .when('/list', {
                templateUrl : '/diary/list/',
                controller  : 'chatController'
            });
    });

selfChat.controller("chatController",function($scope,Message,$http,messageStorage,dateTimeService){
    $scope.time_zone = dateTimeService.getTimeZone();
    $scope.date_today = dateTimeService.getTodayDate();
    $scope.messages = [];
    $scope.pagination = {};
    var localPagination = $scope.pagination;
    localPagination.offset = 0;
    localPagination.pageSize=20;
    localPagination.showNext=true;
    localPagination.showPrev=false;
    localPagination.currentPage = [];
	

    function pageResult(){
                localPagination.currentPage = $scope.messages.slice(0+localPagination.offset,localPagination.pageSize+localPagination.offset);
		if(localPagination.offset + localPagination.pageSize >= $scope.messages.length){
			localPagination.showNext = false;
		}
        }

    $scope.pagination.nextPage = function(){
			localPagination.showPrev=true;
                        localPagination.offset += localPagination.pageSize;
                        pageResult();
                };

    $scope.pagination.prevPage = function(){
                        localPagination.offset -= localPagination.pageSize;
                        pageResult();
                };
    

    $scope.addChatMessage = function(){
                if($scope.messageContent){
                        var newMessage = new Message();
                        newMessage.content = $scope.messageContent;
                        $scope.messages.unshift(newMessage);
                        $scope.messageContent = '';
                	messageStorage.saveMessage(newMessage);
		}
            };
   $scope.loadAllMessages = function(){
		$scope.selected_date = ''+$scope.for_date;
                $scope.load_requested = 'yes' ;
		messageStorage.getAllMessages($scope.for_date).then(function(result){
                        $scope.messages = result;
			pageResult();
        }

	);
	};

    $scope.onKeyEnter = function(keyEvent) {
        if (keyEvent.which == 13)
            $scope.addChatMessage();
        };

});

selfChat.service("messageStorage",function($http,Message,dateTimeService,$window){
                this.getAllMessages = function(for_date) {
                        return $http.get('/diary/list/get_messages/'+for_date +'/').then(

                                function(response){
	                                        if( response.data.indexOf(ERROR_PAGE_FLAG) != -1){
							$window.location.href = "/diary/#/oops"
						} 
						return response.data.map(function(d){
        	                                        var tmp_message =  new Message(angular.fromJson(d));
							tmp_message.event_time = dateTimeService.toLocalTime(tmp_message.event_time);
							return tmp_message;
                        	                        });
                                             },
				function(response){}
                                );
                };

    		this.saveMessage = function(message){
                        $http.post('/diary/add_message/',message).then(
                                function(response){
                                                if( response.data.indexOf(ERROR_PAGE_FLAG) != -1){
                                                        $window.location.href = "/diary/#/oops"
                                                }
                                           
						tmp_messages = response.data.map(function(d){return new Message(angular.fromJson(d));});
                                                message.date_happened = tmp_messages[0].date_happened;
                                                message.event_time = dateTimeService.toLocalTime(tmp_messages[0].event_time);
                                                  },
				function(response){
						message.event_time="Error";
					}
                                );
            };


});

selfChat.service("dateTimeService", function(){

	this.toLocalTime = function(event_time){
		var time_utc = moment.utc(event_time, 'YYYY-MM-DD HH:mm:ss.SSSSSS');
		return time_utc.local().format('HH:mm:ss');
	};
	this.getTimeZone = function(){
		var d = new Date();
		var my_regex = /\((.*)\)/g;
		m_arr =  my_regex.exec(String(d));
		return m_arr[1];
	};
	this.getTodayDate = function(){
		return moment().format('ddd MMM DD YYYY');	
	};


});


selfChat.value("messageDefaults", {
             email_id : '',
             date_happened : '',
             event_time : 'ERROR',
             content : ''
         });


selfChat.factory("Message",function getMessageClass(messageDefaults){
                function Message(defaults){
                    defaults = defaults || messageDefaults;
                    this.email_id = defaults.email_id;
                    this.content = defaults.content;
                    this.date_happened = defaults.date_happened;
                    this.event_time = defaults.time;
                    this.sent_status = 'Sending...';
                };
                return Message;
});
