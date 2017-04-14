var doctor = angular.module('index', [])
	.controller("indexController", ["$scope", "$http", "$window", function indexController($scope, $http, $window){

		
		$scope.formData = {};

		// //$scope.showForm = true; //default to show form on page load

		// $scope.defaultView = true;
		// $scope.loginPanel = false;
		// //$scope.registerView = false;

		// $scope.loginView = function()
		// {
		// 	$scope.defaultView = false;
		// 	$scope.loginPanel = true;
		// 	//$scope.registerView = false;
		// };

		$scope.loginSuccess = false; //Success message is changed to true if form is filled out correctly
		$scope.loginFailed = false;
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

					$scope.loginSuccess = true;
					$scope.loginFailed = false;
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

				$scope.loginFailed = true;
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





		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly

		$scope.ssnError;

		$scope.hospitals = [];

		$http.get("/api/hospitals/names")
			.success(function(names){
				$scope.hospitals = names;
				console.log($scope.hospitals);
			}).error(function(err){
				console.log(err);
				$scope.hospitals = "Error retrieving hospitals";
			});

		$scope.addUser = function() {
		console.log($scope.formData.selectedHospital);
		console.log($scope.formData);


		$http({
			method : 'POST',
			url : '/api/register',
			//headers: {"x-access-token": token},
			data: $scope.formData
		}).success(function(serverResponse) {
				//$scope.formData = {}; //clear form

			console.log(serverResponse);
			$scope.showForm = false;
			$scope.addedAlert = true;


			setTimeout(function(){
					$window.location.href = "/";
			},2000);
				

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