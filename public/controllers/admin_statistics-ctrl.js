var adminStatistics = angular.module("admin_statistics", []);


adminStatistics.controller("admin_statisticsController", function statisticsController($scope, $q, $http, $log, $rootScope) {
    $scope.generateReport = function(report) {
        var token = localStorage.getItem("token");

        $scope.name = report.name + " report";
        $http({
            method: "GET",
            headers: { "x-access-token": token },
            url: '/admin/api/collection/stats/' + report.name
        }).success(function(res) {
            $scope.tableVals = res;
        });
    }
});