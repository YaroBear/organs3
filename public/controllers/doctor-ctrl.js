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
		
		$scope.doctorName = localStorage.getItem("user");
		$scope.defaultView = true;
		$scope.patientView = false;

		$scope.viewHome = function() {
			$scope.defaultView = true;
			$scope.patientView = false;
		};

		$scope.viewPatients = function() {
			$scope.defaultView = false;
			$scope.patientView = true;

			var doctor_id = localStorage.getItem("mongo_id");

			$http({
				method : 'GET',
				url : '/doctor/api/view-patients/' + doctor_id,
				headers: {"x-access-token": token},
			})
				.success(function(serverResponse) {
					console.log(serverResponse);
			})
				.error(function(serverResponse) {

			});

		};
		
}]);