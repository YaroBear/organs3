var admin = angular.module('admin', [])

	.controller("adminController", ["$scope", "$http", "$window", function adminController($scope, $http, $window){

		var token = localStorage.getItem("token");

		$scope.addHospital = function()
		{
			$window.location.href = "/admin/addHospital" + "?token=" + token;
		}
		
		

	
}]);
