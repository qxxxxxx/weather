'use strict';
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'pages/main/main.html',
        controller: 'mainCtrl'
    }).state('forecast', {
        url: '/forecast',
        templateUrl: 'pages/forecast/forecast.html',
        controller: 'forecastCtrl'
    }).state('detail', {
        url: '/detail',
        templateUrl: 'pages/detail/detail.html',
        controller: 'detailCtrl'
    }).state('index', {
        url: '/detail/index?:id',
        templateUrl: 'pages/Index/index.html',
        controller: 'indexCtrl'
    });
    $urlRouterProvider.otherwise('main');
}]);