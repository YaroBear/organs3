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
		var doctor_id = localStorage.getItem("mongo_id");
		$scope.defaultView = true;
		$scope.patientView = false;
		$scope.donorsPanel = false;
		$scope.recipientsPanel = false;

		$http({
			method: "GET",
			url : '/doctor/api/hospital-info/' + doctor_id,
			headers: {"x-access-token": token}
		}).success(function(serverResponse){
			$scope.hospital_info = serverResponse.hospital;
		}).error(function(err){
			console.log("Error:", err);
		});

		$scope.viewHome = function() {
			$scope.defaultView = true;
			$scope.patientView = false;
		};


		$scope.viewPatients = function() {
			$scope.defaultView = false;
			$scope.patientView = true;
			$scope.donorPatients = "";

			$http({
				method : 'GET',
				url : '/doctor/api/view-patients/' + doctor_id,
				headers: {"x-access-token": token},
			})
				.success(function(serverResponse) {
					console.log(serverResponse);

					$scope.donorPatients = serverResponse.patients.donorPatients;
					$scope.recipientPatients = serverResponse.patients.recipientPatients;
			})
				.error(function(serverResponse) {

			});

		};

		$scope.viewDonors = function() {
			$scope.donorsPanel = true;
			$scope.recipientsPanel = false;
		};

		$scope.viewRecipients = function() {
			$scope.donorsPanel = false;
			$scope.recipientsPanel = true;
		};
		
}]);