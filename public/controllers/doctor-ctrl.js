var doctor = angular.module('doctor', [])
	.controller("doctorController", ["$scope", "$http", "$window", function doctorController($scope, $http, $window){

		var token = localStorage.getItem("token");




		
		$scope.doctorName = localStorage.getItem("user");
		var doctor_id = localStorage.getItem("mongo_id");
		$scope.defaultView = true;
		$scope.patientView = false;
		$scope.donorsPanel = false;
		$scope.recipientsPanel = false;
		$scope.matchFound = false;

		$scope.addDonorsPanel = false;
		$scope.addRecipientsPanel = false;

		$scope.addDonorView = function()
		{
			//$window.location.href = "/doctor/addDonor" + "?token=" + token;
			$scope.defaultView = false;
			$scope.addDonorsPanel = true;
			$scope.addRecipientsPanel = false;
			$scope.patientView = false;
		}
		$scope.addRecipientView = function()
		{
			//$window.location.href = "/doctor/addRecipient" + "?token=" + token;
			$scope.defaultView = false;
			$scope.addRecipientsPanel = true;
			$scope.addDonorsPanel = false;
			$scope.patientView = false;
		}


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
			$scope.addDonorsPanel = false;
			$scope.addRecipientsPanel = false;
		};


		$scope.viewPatients = function() {
			$scope.defaultView = false;
			$scope.addDonorsPanel = false;
			$scope.addRecipientsPanel = false;
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
			$scope.addDonorsPanel = false;
			$scope.addRecipientsPanel = false;
		};

		$scope.viewRecipients = function() {
			$scope.donorsPanel = false;
			$scope.recipientsPanel = true;
			$scope.addDonorsPanel = false;
			$scope.addRecipientsPanel = false;
		};

		$scope.logout = function() {
			localStorage.setItem('token', '');
			$window.location.href = "/";
		};

		











		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.donorAddedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.ssnError;

		
		$scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 
			'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 
				'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
					'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 
						'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
		$scope.organTypes = [ 'Heart', 'Liver', 'Lung', 'Pancreas', 'Kidney'];
		$scope.bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
		$scope.deceasedTypes = ['Yes', 'No'];
		$scope.sexes = ['F', 'M'];
		$scope.urgencies = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


		$scope.formData.doctor_id = localStorage.getItem("mongo_id");
		$scope.addDonor = function() {
		//console.log($scope.formData.selectedRegion);
		var token = localStorage.getItem("token");

		$http({
			method : 'POST',
			url : '/doctor/api/donors',
			headers: {"x-access-token": token},
			data: $scope.formData
		}).success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.donorAddedAlert = true;

			setTimeout(function(){
					$window.location.href = "/doctor/home?token=" + token;
					//$scope.defaultView = true;
					// $scope.patientView = false;
					// $scope.addDonorsPanel = false;
					//$scope.addDonorsPanel = false;
			},2000);
				

			})
			.error(function(err) {
				console.log("Error: ", err);

				// reset error code messages
				$scope.firstNameError = "";
				$scope.lastNameError = "";
				$scope.ssnError = "";
				$scope.streetError = "";
				$scope.cityError = "";
				$scope.stateError = "";
				$scope.zipError = "";

				$scope.organTypeError = "";
				$scope.sexError = "";
				$scope.heightError = "";
				$scope.weightError = "";
				$scope.bloodTypeError = "";
				$scope.HLAError = "";
				$scope.organSizeError = "";
				$scope.deceasedError = "";
				$scope.phoneNumberError = "";
				$scope.dobError = "";

				if (err.errors.validationError)
				{
					var errors = err.errors.validationError.errors;

					if (errors["name.firstName"])
					{
						$scope.firstNameError = errors["name.firstName"].message;
					}
					if (errors["name.lastName"])
					{
						$scope.lastNameError = errors["name.lastName"].message;
					}
					if (errors.ssn)
					{
						$scope.ssnError = errors.ssn.message;
					}
					if (errors["address.street"])
					{
						$scope.streetError = errors["address.street"].message;
					}
					if (errors["address.city"])
					{
						$scope.cityError = errors["address.city"].message;
					}
					if (errors["address.state"])
					{
						$scope.stateError = errors["address.state"].message;
					}

					if (errors["address.zip"])
					{
						$scope.zipError = errors["address.zip"].message;
					}

					if (errors.phoneNumber)
					{
						$scope.phoneNumberError = errors.phoneNumber.message;
					}

					if (errors.organType)
					{
						$scope.organTypeError = errors.organType.message;
					}
					if (errors.sex)
					{
						$scope.sexError = errors.sex.message;
					}


					if (errors.height)
					{
						$scope.heightError = errors.height.message;
					}
					if (errors.weight)
					{
						$scope.weightError = errors.weight.message;
					}
					if (errors.bloodType)
					{
						$scope.bloodTypeError = errors.bloodType.message;
					}
					if (errors.HLAType)
					{
						$scope.HLATypeError = errors.HLAType.message;
					}
					if (errors.organSize)
					{
						$scope.organSizeError = errors.organSize.message;
					}
					if (errors.deceased)
					{
						$scope.deceasedError = errors.deceased.message;
					}
					if (errors.dob)
					{
						$scope.dobError = errors.dob.message;
					}
				}

				if (err.errors.ssnExists)
				{
					$scope.ssnError = err.errors.ssnExists;
				}

			});
		};



		$scope.recipientAddedAlert = false; //Success message is changed to true if form is filled out correctly
		
		$scope.formData.doctor_id = localStorage.getItem("mongo_id");
		$scope.addRecipient = function() {
		//console.log($scope.formData.selectedRegion);
		var token = localStorage.getItem("token");

		$http({
			method : 'POST',
			url : '/doctor/api/recipients',
			headers: {"x-access-token": token},
			data: $scope.formData
		}).success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.recipientAddedAlert = true;

			setTimeout(function(){
					$window.location.href = "/doctor/home?token=" + token;
					//$scope.defaultView = true;
					// $scope.patientView = false;
					// $scope.addDonorsPanel = false;
					//$scope.addRecipientsPanel = false;
			},2000);
				

			})
			.error(function(err) {
				console.log("Error: ", err);

				// reset error code messages

				$scope.firstNameError = "";
				$scope.lastNameError = "";
				$scope.ssnError = "";
				$scope.streetError = "";
				$scope.cityError = "";
				$scope.stateError = "";
				$scope.zipError = "";

				$scope.organTypeError = "";
				$scope.sexError = "";
				$scope.heightError = "";
				$scope.weightError = "";
				$scope.bloodTypeError = "";
				$scope.HLATypeError = "";
				$scope.organSizeError = "";
				$scope.urgencyError = "";
				$scope.phoneNumberError = "";
				$scope.dobError = "";

				if (err.errors.validationError)
				{
					var errors = err.errors.validationError.errors;

					if (errors["name.firstName"])
					{
						$scope.firstNameError = errors["name.firstName"].message;
					}
					if (errors["name.lastName"])
					{
						$scope.lastNameError = errors["name.lastName"].message;
					}
					if (errors.ssn)
					{
						$scope.ssnError = errors.ssn.message;
					}
					if (errors["address.street"])
					{
						$scope.streetError = errors["address.street"].message;
					}
					if (errors["address.city"])
					{
						$scope.cityError = errors["address.city"].message;
					}
					if (errors["address.state"])
					{
						$scope.stateError = errors["address.state"].message;
					}

					if (errors["address.zip"])
					{
						$scope.zipError = errors["address.zip"].message;
					}

					if (errors.phoneNumber)
					{
						$scope.phoneNumberError = errors.phoneNumber.message;
					}

					if (errors.organType)
					{
						$scope.organTypeError = errors.organType.message;
					}
					if (errors.sex)
					{
						$scope.sexError = errors.sex.message;
					}


					if (errors.height)
					{
						$scope.heightError = errors.height.message;
					}
					if (errors.weight)
					{
						$scope.weightError = errors.weight.message;
					}
					if (errors.bloodType)
					{
						$scope.bloodTypeError = errors.bloodType.message;
					}
					if (errors.HLAType)
					{
						$scope.HLATypeError = errors.HLAType.message;
					}
					if (errors.organSize)
					{
						$scope.organSizeError = errors.organSize.message;
					}
					if (errors.urgency)
					{
						$scope.urgencyError = errors.urgency.message;
					}
					if (errors.dob)
					{
						$scope.dobError = errors.dob.message;
					}
				}

				if (err.errors.ssnExists)
				{
					$scope.ssnError = err.errors.ssnExists;
				}

			});
		};
}]);