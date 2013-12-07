angular.module('googleChartWrap', [])
    .directive('googleChart', function () {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attr) {
                $scope.$watch($attr.data, function (value) {
                    var data = new google.visualization.DataTable();
                    //need to change shop, cost, date
                    data.addColumn('string', 'Store');
                    data.addColumn('number', 'Cost');

 
                    angular.forEach(value, function (row) {
                        data.addRow([row.Store, row.Cost]);
                    });
 
                    var options = {
                        title: $attr.title,
                        pieSliceText: 'label',
                        legend: 'rightss'
                    };
 
                    //render the desired chart based on the type attribute provided
                    var chart;
                    chart = new google.visualization.BarChart(document.getElementById('piechart'));   
                    chart.draw(data, options);
                });
            }
        }
    });