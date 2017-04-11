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
		$scope.matchFound = false;

		$http({
			method: "GET",
			url : '/doctor/api/hospital-info/' + doctor_id,
			headers: {"x-access-token": token}
		}).success(function(serverResponse){
			$scope.hospital_info = serverResponse.hospital;
		}).error(function(err){
			console.log("Error:", err);
		});

		$http({
			method: "GET",
			url : '/doctor/api/doctor-notification/' + doctor_id,
			headers: {"x-access-token": token}
		}).success(function(serverResponse){

			$scope.matchFound = true;
			$scope.score_info = serverResponse.notification.scores;

			if (serverResponse.hasNotification)
			{
				var request = {};
				request.recipient_id = serverResponse.notification.recipient;
				request.donor_id = serverResponse.notification.donor;
				$http({
					method: "POST",
					url : '/doctor/api/view-recipient-donor-info/',
					headers: {"x-access-token": token},
					data: JSON.stringify(request)
				}).success(function(serverResponse){
					console.log(serverResponse);
					$scope.recipient_info = serverResponse.response.recipient;
					$scope.donor_info = serverResponse.response.donor;
				}).error(function(err){
					console.log("Error:", err);
				});

				console.log(serverResponse);
			}

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

		$scope.logout = function() {
			localStorage.setItem('token', '');
			$window.location.href = "/";
		};

		
}]);