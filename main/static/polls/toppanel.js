
var top_panel_module = angular.module("topPanel",[]).config(function($interpolateProvider){
                        $interpolateProvider.startSymbol('{$');
                        $interpolateProvider.endSymbol('$}');
                        });

top_panel_module.controller("topController" , function($scope,userService){
	$scope.logged_user = userService.getLoggedInUser().then(function(d){
				console.log("USR " +d);
				return d;
			});
});

top_panel_module.service("userService", function($http){
	this.getLoggedInUser = function(){
		return $http.get('/polls/user_info/').then(
			function(response){
				return response.data;
			},
			function(response){
				return 'ERROR';
			}
		);
	};
		
});
