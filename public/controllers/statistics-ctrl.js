var register = angular.module("statistics", [])
    .controller("statisticsController", ["$scope", "$http", function statisticsController($scope, $http) {
        $scope.generateChart = function(report) {
            // console.log(report);
            var start_date = report["startDate"];
            var end_date = report["endDate"];
            var reportType = report["name"];
            var graphType = report["type"];
            var organ = report["organ"];
            // console.log(start_date);
            if (start_date != undefined || end_date != undefined) {
                if (reportType == "donors") {
                    // '/api/donors/waitlist/:organ/:start_date?/:end_date?'
                    // $http.get();
                    $http({
                        method: "GET",
                        url: '/api/donors/waitlist/' + organ + "/" + start_date + "/" + end_date

                    }).then(function(res) {
                        console.log(res.data);

                    });
                }

            } else {
                if (reportType == "donors") {
                    // '/api/donors/waitlist/:organ/:start_date?/:end_date?'
                    // $http.get();
                    $http({
                        method: "GET",
                        url: '/api/donors/waitlist/' + organ

                    }).then(function(res) {
                        console.log(res.data);
                    });
                }
            }


            // Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function(err, rows) {
            //     var YEAR = 2007;
            //     var continents = ['Asia', 'Europe', 'Africa', 'Oceania', 'Americas'];
            //     var POP_TO_PX_SIZE = 2e5;

            //     function unpack(rows, key) {
            //         return rows.map(function(row) { return row[key]; });
            //     }

            //     var data = continents.map(function(continent) {
            //         var rowsFiltered = rows.filter(function(row) {
            //             return (row.continent === continent) && (+row.year === YEAR);
            //         });
            //         return {
            //             mode: 'markers',
            //             name: continent,
            //             x: unpack(rowsFiltered, 'lifeExp'),
            //             y: unpack(rowsFiltered, 'gdpPercap'),
            //             text: unpack(rowsFiltered, 'country'),
            //             marker: {
            //                 sizemode: 'area',
            //                 size: unpack(rowsFiltered, 'pop'),
            //                 sizeref: POP_TO_PX_SIZE
            //             }
            //         };
            //     });
            //     var layout = {
            //         xaxis: { title: 'Life Expectancy' },
            //         yaxis: { title: 'GDP per Capita', type: 'log' },
            //         margin: { t: 20 },
            //         hovermode: 'closest'
            //     };
            //     Plotly.plot(document.getElementById('tester'), data, layout, { showLink: false });
            // });
        }
    }]);