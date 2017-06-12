'use strict';
angular.module('app').directive('appForecastList', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'pages/common/forecastList/forecastList.html',
        scope: {
            data: '=',
            weatherBg: '=',
            weatherIcon: '=',
            pageAn: '='
        }
    }
}]);