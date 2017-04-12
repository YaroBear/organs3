var admin = angular.module('admin', [])
	.controller("adminController", ["$scope", "$http", "$window", function adminController($scope, $http, $window){

		var token = localStorage.getItem("token");

		$scope.gotoaddHospital = function()
		{
			$window.location.href = "/admin/addHospital" + "?token=" + token;
		}
		$scope.gotomanageHospitals = function()
		{
			$window.location.href = "/admin/manageHospitals" + "?token=" + token;
		}
		
		$scope.logout = function() {
			localStorage.setItem('token', '');
			$window.location.href = "/";
		};

	
}]);