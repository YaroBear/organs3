var manageHospitals = angular.module('manageHospitals', [])
	.controller("managehospitalsController", ["$scope", "$http", "$window", function managehospitalsController($scope, $http, $window){
		$scope.formData = {};

		$scope.showForm = true; //default to show form on page load

		$scope.addedAlert = false; //Success message is changed to true if form is filled out correctly
		var token = localStorage.getItem("token");

		$scope.enableMove = function (hosp)
		{
			hosp.movedoc = true;

		}
		$scope.doMove = function (hosp)
		{
			$scope.moveData = {};
			$scope.moveData.docid = hosp.docid;
			$scope.moveData.destHosp = hosp.destHosp;
			$scope.moveData.oldHosp = hosp._id;
			console.log("moveData: ", $scope.moveData);

			if ("undefined" === typeof $scope.moveData.docid)
			{
				//error occured
				console.log("Doctor undefined");
				console.log($scope.moveData.docid);
			}
			else if ("undefined" === typeof $scope.moveData.destHosp) 
			{
				//error occured
				console.log("Destination Hospital undefined");
				console.log(scope.moveData.destHosp);
			}
			else if ("undefined" === typeof $scope.moveData.oldHosp)
			{
				//error occured
				console.log("Old Hospital undefined");
				console.log($scope.moveData.oldHost);
			}

			else
			{
				$http({
				method : 'POST',
				url : '/admin/api/hospital/moveDoctors',
				headers: {"x-access-token": token},
				data: $scope.moveData
				})
				.success(function(serverResponse) {
					//alert("Doctor Moved Successfully")
					console.log("Doctor Moved Successfully");
				})
				.error(function(serverResponse) {
					console.log("Error: ", serverResponse);
				});
			}


			hosp.movedoc = false;
		}
		$scope.cancel = function (hosp)
		{
			$scope.moveData = {};
			hosp.movedoc = false;
		}

		$scope.deletePrompt = function (hosp)
		{
			//console.log(hosp.name);
			if (hosp.doctors.length != 0)
			{
				alert("Doctors exist in this hospital, fire or transfer them before removing the hospital");
			}
			else
			{
				hosp.delete = true;
			}
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
			    console.log($scope.hospitals[0]);
				for (var hospital in $scope.hospitals)
			    {
			    	console.log("doing hospital: " , hospital.name);
			    	for (doc in hospital.doctors)
			    	{
				    	hospital.doctorslen = doc.length;
				    	console.log("set ", hospital.name , " to " , hospital.doctorslen, " when it was ", doc.length);
			    		
			    	}
			    }
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			});
		}
		$scope.loadHospList();

		
	}]);

