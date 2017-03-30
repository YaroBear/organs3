var authenticate = angular.module('authenticate', [])
	.controller("authenticationController", ["$scope", "$http", function authenticationcontroller($scope, $http){
		$scope.formData = {};

		$scope.ssnError;

		$scope.authenticateUser = function() {
		$http.post('/api/authenticate', $scope.formData)
			.success(function(serverResponse) {
				//$scope.formData = {}; //clear form
				var errors = serverResponse.errors;

				if (errors){
					if (errors.username.message)
					{
						$scope.usernameError = errors.username.message;
					}
					if (errors.password.message)
					{
						$scope.passwordError = errors.password.message;
					}

				}
				console.log(serverResponse);

				
				if (serverResponse.success == true){
					console.log("SUCCESSFUL SERVER RESPONSE, STORING TOKEN");
					localStorage.setItem('token', serverResponse.token);
				}

				// var t = localStorage.getItem('token');
				// console.log("retrieving token" + t);

			})
			.error(function(err) {
				console.log("Error: " + err);
			});
		};
	}]);