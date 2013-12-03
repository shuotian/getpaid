angular.module('googleChartWrap', [])
    .directive('googleChart', function () {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attr) {
                $scope.$watch($attr.data, function (value) {
                    var data = new google.visualization.DataTable();
                    //need to change shop, cost, date
                    data.addColumn('string', 'name');
                    data.addColumn('number', 'votes');
 
                    angular.forEach(value, function (row) {
                        data.addRow([row.name, row.votes]);
                    });
 
                    var options = {
                        title: $attr.title,
                        height: $attr.height,
                        width: $attr.width,
                        legend: 'right'
                    };
 
                    //render the desired chart based on the type attribute provided
                    var chart;
                    chart = new google.visualization.PieChart($elm[0]);   
                    chart.draw(data, options);
                });
            }
        }
    });