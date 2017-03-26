var register = angular.module('register', [])
	.controller("doctorController", ["$scope", "$http", function doctorController($scope, $http){
		$scope.formData = {};

		$scope.addDoctor = function() {
		$http.post('/api/doctors', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; //clear form
				$scope.doctor = data;
				console.log(data);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
		};
	}]);

