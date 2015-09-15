var ERROR_PAGE_FLAG = "Something went wrong";

var selfChat = angular.module("selfChat", ['pikaday','ngRoute']).config(function($interpolateProvider){
                        $interpolateProvider.startSymbol('{$');
                        $interpolateProvider.endSymbol('$}');
                        });

    selfChat.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : '/polls/about/',
                controller  : 'chatController'
            })
            .when('/entry', {
                templateUrl : '/polls/entry/',
                controller  : 'chatController'
            })
            .when('/oops', {
                templateUrl : '/polls/oops/',
                controller  : 'chatController'
            })
            .when('/list', {
                templateUrl : '/polls/list/',
                controller  : 'chatController'
            });
    });

selfChat.controller("chatController",function($scope,Message,$http,messageStorage,dateTimeService){
    $scope.time_zone = dateTimeService.getTimeZone();
    $scope.date_today = dateTimeService.getTodayDate();
    $scope.messages = [];
    $scope.addChatMessage = function(){
                if($scope.messageContent){
                        var newMessage = new Message();
                        newMessage.content = $scope.messageContent;
                        $scope.messages.push(newMessage);
                        $scope.messageContent = '';
                	messageStorage.saveMessage(newMessage);
		}
            };
   $scope.loadAllMessages = function(){
		$scope.selected_date = ''+$scope.for_date;
                messageStorage.getAllMessages($scope.for_date).then(function(result){
                        $scope.messages = result;
        });
	};

    $scope.onKeyEnter = function(keyEvent) {
        if (keyEvent.which == 13)
            $scope.addChatMessage();
        };

});

selfChat.service("messageStorage",function($http,Message,dateTimeService,$window){
                this.getAllMessages = function(for_date) {
                        return $http.get('/polls/list/get_messages/'+for_date +'/').then(

                                function(response){
					console.log(response.data);
	                                        if( response.data.indexOf(ERROR_PAGE_FLAG) != -1){
							$window.location.href = "/polls/#/oops"
						} 
						return response.data.map(function(d){
        	                                        var tmp_message =  new Message(angular.fromJson(d));
							tmp_message.event_time = dateTimeService.toLocalTime(tmp_message.event_time);
							return tmp_message;
                        	                        });
                                             }
                                );
                };

    		this.saveMessage = function(message){
                        $http.post('/polls/add_message/',message).then(
                                function(response){
                                                if( response.data.indexOf(ERROR_PAGE_FLAG) != -1){
                                                        $window.location.href = "/polls/#/oops"
                                                }
                                           
						tmp_messages = response.data.map(function(d){return new Message(angular.fromJson(d));});
                                                message.date_happened = tmp_messages[0].date_happened;
                                                message.event_time = dateTimeService.toLocalTime(tmp_messages[0].event_time);
                                                message.sent_status = 'Sent on';
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
             event_time : '',
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

