
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
            .when('/list', {
                templateUrl : '/polls/list/',
                controller  : 'chatController'
            });
    });

selfChat.controller("chatController",function($scope,Message,$http,messageStorage){
    $scope.allMessages = [];
    $scope.addChatMessage = function(){
                if($scope.messageContent){
                        var newMessage = new Message();
                        newMessage.content = $scope.messageContent;
                        $scope.allMessages.push(newMessage);
                        $scope.messageContent = '';
                	messageStorage.saveMessage(newMessage);
		}
            };
   $scope.loadAllMessages = function(){
                messageStorage.getAllMessages($scope.for_date).then(function(result){
                        $scope.messages = result;
        });
	};

    $scope.onKeyEnter = function(keyEvent) {
        if (keyEvent.which == 13)
            $scope.addChatMessage();
        };

});

selfChat.service("messageStorage",function($http,Message,dateTimeService){
                this.getAllMessages = function(for_date) {
                        return $http.get('/polls/list/get_messages/babandi@cisco.com/'+for_date +'/').then(

                                function(response){
                                                        return response.data.map(function(d){
                                                                var tmp_message =  new Message(angular.fromJson(d));
								console.log(tmp_message);
								tmp_message.event_time = dateTimeService.toLocalTime(tmp_message.event_time);
								return tmp_message;
                                                                });
                                                  }
                                );
                };

    		this.saveMessage = function(message){
                        $http.post('add_message/',message).then(
                                function(response){
                                                
						tmp_messages = response.data.map(function(d){return new Message(angular.fromJson(d));});
                                                message.date_happened = tmp_messages[0].date_happened;
                                                message.event_time = dateTimeService.toLocalTime(tmp_messages[0].event_time);
                                                message.sent_status = 'Sent on';
                                                  },
				function(response){
						window.location.href = '/admin/login/'
						  }
                                );
            };


});

selfChat.service("dateTimeService", function(){

	this.toLocalTime = function(event_time){
		var time_utc = new Date(0);
                time_utc.setUTCSeconds(event_time);
		return String(time_utc).replace(/GMT[+-]\d\d\d\d/g,"");
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
                    this.event_time = defaults.event_time;
                    this.sent_status = 'Sending...';
                };
                return Message;
});

