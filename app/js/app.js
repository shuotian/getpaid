'use strict';


// Declare app level module which depends on filters, and services
var getpaidApp = angular.module('getpaidApp', [
  'ngRoute',
  'ngTouch',
  'getpaidControllers',
  'getpaidApp.filters',
  'getpaidApp.services',
  'getpaidApp.directives',
]);

getpaidApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/receipts', {templateUrl: 'partials/receipt-list.html', controller: 'ReceiptListCtrl'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/receipts/stats', {templateUrl: 'partials/receipt-stats.html', controller: 'StatsCtrl'});
  $routeProvider.when('/receipts/add', {templateUrl: 'partials/receipt-new.html', controller: 'NewReceiptCtrl'});
  $routeProvider.when('/receipts/:receiptId', {templateUrl: 'partials/receipt-details.html', controller: 'ReceiptDetailCtrl'});
  $routeProvider.when('/receipts/edit/:receiptId', {templateUrl: 'partials/receipt-new.html', controller: 'ReceiptEditCtrl'});
  $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
