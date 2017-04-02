var authenticate = angular.module('authenticate', [])
	.controller("authenticationController", ["$scope", "$http", function authenticationcontroller($scope, $http){
		$scope.formData = {};


		$scope.authenticateUser = function() {
		$http.post('/api/authenticate', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form
				var errors = serverResponse.errors;

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
				console.log(serverResponse);

				
				if (serverResponse.success == true){
					console.log("SUCCESSFUL SERVER RESPONSE, STORING TOKEN");
					localStorage.setItem('token', serverResponse.token);
					localStorage.setItem('user', serverResponse.user);
				}

			})
			.error(function(err) {
				console.log("Error: " + err);
			});
		};
	}]);