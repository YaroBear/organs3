var doctor = angular.module('doctor', [])
	.controller("doctorController", ["$scope", "$http", "$window", function doctorController($scope, $http, $window){

		var token = localStorage.getItem("token");

		$scope.addDonor = function()
		{
			$window.location.href = "/doctor/addDonor" + "?token=" + token;
		}
		$scope.addRecipient = function()
		{
			$window.location.href = "/doctor/addRecipient" + "?token=" + token;
		}
		

	
}]);