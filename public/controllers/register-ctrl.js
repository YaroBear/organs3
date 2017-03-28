var register = angular.module('register', [])
	.controller("doctorController", ["$scope", "$http", function doctorController($scope, $http){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.ssnError;

		$scope.addDoctor = function() {
		$http.post('/api/doctors', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.addedAlert = true;
				

			})
			.error(function(err) {
				console.log("Error: ", err);

				// reset error code messages
				$scope.ssnError = "";
				$scope.nameError = "";
				$scope.usernameError = "";
				$scope.passwordError = "";
				$scope.permCodeError = "";

				if (err.errors.validationError)
				{
					var errors = err.errors.validationError.errors;
					if (errors.ssn)
					{
						$scope.ssnError = errors.ssn.message;
					}
					if (errors.name)
					{
						$scope.nameError = errors.name.message;
					}
					if (errors.username)
					{
						$scope.usernameError = errors.username.message;
					}
					if (errors.password)
					{
						$scope.passwordError = errors.password.message;
					}
				}
				if (err.errors.permCode)
				{
					$scope.permCodeError = err.errors.permCode;
				}
				if (err.errors.ssnExists)
				{
					$scope.ssnError = err.errors.ssnExists;
				}
				if (err.errors.usernameExists)
				{
					$scope.usernameError = err.errors.usernameExists;
				}

			});
		};
	}]);

