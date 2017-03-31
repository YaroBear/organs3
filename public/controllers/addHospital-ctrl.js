var addHospital = angular.module('addHospital', [])
	.controller("hospitalController", ["$scope", "$http", function hospitalController($scope, $http){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		//$scope.ssnError;

		//$scope.hospitals = [];

		$scope.regions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
		$scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
		// $http.get("/api/hospitals/names")
		// 	.success(function(names){
		// 		$scope.hospitals = names;
		// 	}).error(function(err){
		// 		console.log(err);
		// 		$scope.hospitals = "Error retrieving hospitals";
		// 	});

		$scope.addHospital = function() {
		console.log($scope.formData.selectedRegion);

		$http.post('/api/hospitals', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.addedAlert = true;
				

			})
			.error(function(err) {
				console.log("Error: ", err);

				// reset error code messages

				$scope.nameError = "";


				if (err.errors.validationError)
				{
					var errors = err.errors.validationError.errors;

					if (errors.name)
					{
						$scope.nameError = errors.name.message;
					}
					if (errors.street)
					{
						$scope.streetError = errors.street.message;
					}
					if (errors.city)
					{
						$scope.cityError = errors.city.message;
					}
					if (errors.zip)
					{
						$scope.zipError = errors.zip.message;
					}

					if (errors.phoneNumber)
					{
						$scope.phoneNumberError = errors.phoneNumber.message;
					}
				}

				if (err.errors.nameExists)
				{
					$scope.nameError = err.errors.nameExists;
				}
				if (err.errors.addressExists)
				{
					$scope.addressError = err.errors.addressExists;
				}

			});
		};
	}]);

