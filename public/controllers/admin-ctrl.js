var admin = angular.module('admin', [])
	.controller("adminController", ["$scope", "$http", function adminController($scope, $http){

		$scope.message = "";
		var token = localStorage.getItem(token);
		console.log("admin controller token = " + token);
		$http({
			method: "GET",
			url: "/admin"
			headers: {"x-access-token" : token}

		}).success(function(serverResponse) {
			
			$scope.message = "Yay you logged in!";

			//display information and buttons

		}).error(function(err) {

			$scope.message = "You dont have access to this page";
	});
}]);