'use strict';
angular.module('app').directive('appCity', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'pages/city/city.html',
        scope: {
            city: '=',
            visible: '=',
            hotList: '=',
            chooseCity: '=',
            searchInfo: '='
        }
    }
}]);