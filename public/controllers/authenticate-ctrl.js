var authenticate = angular.module('authenticate', [])
	.controller("authenticationController", ["$scope", "$http", function authenticationcontroller($scope, $http){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.loginSuccess = false; //Success message is changed to true if form is filled out correctly


		$scope.authenticateUser = function() {
		$http.post('/api/authenticate', $scope.formData)
			.success(function(serverResponse) {

				if (serverResponse.success == true){
					console.log("SUCCESSFUL SERVER RESPONSE, STORING TOKEN");
					localStorage.setItem('token', serverResponse.token);
					localStorage.setItem('user', serverResponse.user);

					$scope.showForm = false;
					$scope.loginSuccess = true;
					$scope.userFullName = serverResponse.user;
				}

			})
			.error(function(serverResponse) {
				var errors = serverResponse.errors;
				console.log("Error: " , errors);
				console.log(serverResponse);
				//reset error messages
				$scope.usernameError = "";
				$scope.passwordError = "";

				if (errors){
					if (errors.usernameError)
					{
						$scope.usernameError = errors.usernameError.message;
					}
					if (errors.passwordError)
					{
						$scope.passwordError = errors.passwordError.message;
					}

				}
			});
		};
	}]);