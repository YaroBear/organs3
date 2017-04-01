var addRecipient = angular.module('addRecipient', [])
	.controller("recipientController", ["$scope", "$http", function recipientController($scope, $http){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.ssnError;

		//$scope.hospitals = [];

		
		$scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
		
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

		$scope.addRecipient = function() {
		//console.log($scope.formData.selectedRegion);

		$http.post('/api/recipients', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.addedAlert = true;
				

			})
			.error(function(err) {
				console.log("Error: ", err);

				// reset error code messages

				$scope.firstNameError = "";
				$scope.lastNameError = "";
				$scope.ssnError = "";
				$scope.streetError = "";
				$scope.cityError = "";
				$scope.zipError = "";
				$scope.HLAError = "";
				$scope.heightError = "";
				$scope.weightError = "";


				if (err.errors.validationError)
				{
					var errors = err.errors.validationError.errors;

					if (errors.firstName)
					{
						$scope.firstNameError = errors.firstName.message;
					}
					if (errors.lastName)
					{
						$scope.lastNameError = errors.lastName.message;
					}
					if (errors.ssn)
					{
						$scope.ssnError = errors.ssn.message;
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

					if (errors.HLAType)
					{
						$scope.HLATypeError = errors.HLAType.message;
					}
					if (errors.height)
					{
						$scope.heightError = errors.height.message;
					}
					if (errors.weight)
					{
						$scope.weightError = errors.weight.message;
					}
				}

				if (err.errors.ssnExists)
				{
					$scope.ssnError = err.errors.ssnExists;
				}

			});
		};
	}]);

