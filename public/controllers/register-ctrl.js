var register = angular.module('register', [])
	.controller("doctorController", ["$scope", "$http", function doctorController($scope, $http){
		$scope.formData = {};

		$scope.ssnError;

		$scope.addDoctor = function() {
		$http.post('/api/doctors', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form
				var errors = serverResponse.errors;
				if (errors.ssn.message)
				{
					$scope.ssnError = errors.ssn.message;
				}
				if (errors.name.message)
				{
					$scope.nameError = errors.name.message;
				}
				if (errors.username.message)
				{
					$scope.usernameError = errors.username.message;
				}
				if (errors.password.message)
				{
					$scope.passwordError = errors.password.message;
				}
				if (errors.code.message)
				{
					$scope.codeError = errors.code.message;
				}

			})
			.error(function(err) {
				console.log("Error: " + err);
			});
		};
	}]);

