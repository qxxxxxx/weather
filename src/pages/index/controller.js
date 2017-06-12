'use strict';
angular.module('app').controller('indexCtrl', ['dict', '$state', '$scope', function(dict, $state, $scope) {
    $scope.info = {
        cont: dict.cont,
        city: dict.city,
        cityId: dict.cityId,
        weather: dict.weather,
    };
    $scope.pageAn = function(a) {
        if (a) {
            dict.pageAnimate.status = 'pre';
        } else {
            dict.pageAnimate.status = 'next';
        }
    };
    $scope.anInfo = {
        pageAn: dict.pageAnimate.status
    };
}]);