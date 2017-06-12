'use strict';
angular.module('app').directive('appHeadBar', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'pages/common/headBar/headBar.html',
        scope: {
            text: '@',
            pageAn: '=',
            anInfo: '='
        },
        link: function($scope) {
            $scope.goBack = function() {
                window.history.back();
            }
        }
    }
}]);