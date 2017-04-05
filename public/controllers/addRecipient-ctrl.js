var addRecipient = angular.module('addRecipient', [])
	.controller("recipientController", ["$scope", "$http", "$window", function recipientController($scope, $http, $window){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.ssnError;

		//$scope.hospitals = [];

		
		$scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 
			'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 
				'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
					'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 
						'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
		$scope.bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
		$scope.organTypes = [ 'Heart', 'Liver', 'Lung', 'Pancreas', 'Kidney'];
		$scope.urgencies = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		$scope.sexes = ['F', 'M'];

		// $http.get("/api/hospitals/names")
		// 	.success(function(names){
		// 		$scope.hospitals = names;
		// 	}).error(function(err){
		// 		console.log(err);
		// 		$scope.hospitals = "Error retrieving hospitals";
		// 	});
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
			$scope.addedAlert = true;

			setTimeout(function(){
					$window.location.href = "/doctor/home?token=" + token;
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
				$scope.urgencyError = "";
				$scope.phoneNumberError = "";


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
				}

				if (err.errors.ssnExists)
				{
					$scope.ssnError = err.errors.ssnExists;
				}

			});
		};
	}]);

