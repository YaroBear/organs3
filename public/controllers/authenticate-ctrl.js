var authenticate = angular.module('authenticate', [])
	.controller("authenticationController", ["$scope", "$http", "$window", function authenticationcontroller($scope, $http, $window){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.loginSuccess = false; //Success message is changed to true if form is filled out correctly

		$scope.usernameError = "";
		$scope.passwordError = "";

		$scope.authenticateUser = function() {
		$http.post('/api/authenticate', $scope.formData)
			.success(function(serverResponse) {

				if (serverResponse.success == true){
					console.log("SUCCESSFUL SERVER RESPONSE, STORING TOKEN");
					localStorage.setItem('token', serverResponse.token);
					localStorage.setItem('user', serverResponse.user);
					localStorage.setItem('userType', serverResponse.userType);
					localStorage.setItem('mongo_id', serverResponse.mongo_id);
					$scope.showForm = false;
					$scope.loginSuccess = true;
					$scope.userFullName = serverResponse.user;
				}

				var redirect = "";
				if (serverResponse.userType == "admin")
				{
					redirect = "/admin/home";
				}
				else
				{
					redirect = "/doctor/home";
				}

				setTimeout(function(){
					$window.location.href = redirect + "?token=" + serverResponse.token;
				},2000);

				

			})
			.error(function(serverResponse) {
				var errors = serverResponse.errors;
				console.log("Error: " , errors);

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