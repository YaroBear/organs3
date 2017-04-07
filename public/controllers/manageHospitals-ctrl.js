var manageHospitals = angular.module('manageHospitals', [])
	.controller("managehospitalsController", ["$scope", "$http", "$window", function managehospitalsController($scope, $http, $window){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly
		var token = localStorage.getItem("token");

		$scope.deletePrompt = function (hosp)
		{
			//console.log(hosp.name);
			hosp.delete = true;
		}
		$scope.dontDelete = function (hosp)
		{
			hosp.delete = false;
		}
		$scope.confirmDelete = function (hosp)
		{

			$scope.formData.id = hosp._id;
			$http({
				method : 'POST',
				url : '/admin/api/deletehospital',
				headers: {"x-access-token": token},
				data: $scope.formData
				})
			.success(function(serverResponse) {
				$scope.showForm = false;
				$scope.addedAlert = true;
			})
			.error(function(serverResponse) {
				console.log("Error: ", serverResponse);
			});
		
			alert(hosp.name + " has been deleted!");
			$scope.loadHospList();
		}

		$scope.gotoaddHospital = function()
		{
			$window.location.href = "/admin/addHospital" + "?token=" + token;
		}
		$scope.gotomanageHospitals = function()
		{
			$window.location.href = "/admin/manageHospitals" + "?token=" + token;
		}


		$scope.loadHospList = function ()
		{
			$scope.hospitals = "";

			$http({
				method: 'GET',
				url: '/admin/api/hospitals',
				headers: {"x-access-token": token}
			}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
			    //console.log(response.data[0].address.street);
			    $scope.hospitals = response.data;
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			});
		}
		$scope.loadHospList();

		
	}]);

