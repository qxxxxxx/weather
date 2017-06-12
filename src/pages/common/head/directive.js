'use strict';
angular.module('app').directive('appHead', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'pages/common/head/head.html',
        scope: {
            city: '=',
            visible: '=',
            chooseCity: '=',
            scroll: '&'
        },
        link: function($scope) {
            var _op = 0;
            var body = document.body;
            $scope.scrolling = function(e) {
                document.onmousewheel = function(e) {
                    if (e.wheelDelta < 0) {
                        if (body.scrollTop < 51) {
                            _op += 5 / 50;
                        } else {
                            _op = 1;
                        }
                    } else {
                        if (body.scrollTop < 51 && body.scrollTop > 0) {
                            _op -= 5 / 50;
                        } else if (body.scrollTop == 0) {
                            _op = 0;
                        }
                    }
                    $scope.st = { 'background': 'rgba(255, 255, 255,' + _op + ')' };
                    $scope.$apply();
                };
                var _sY;
                body.addEventListener('touchstart', function(e) {

                    _sY = e.touches[0].screenY;
                });

                body.addEventListener('touchmove', function(e) {

                    var _t = e.touches[0];
                    var _cY = _t.screenY;
                    if (_op <= 1 && _op >= 0) {
                        if (_cY - _sY > 0) { //向上滚动
                            _op -= 5 / 50;
                        } else {
                            _op += 5 / 50;
                        }
                    } else if (_op > 1) {
                        _op = 1;
                    } else if (_op < 0) {
                        _op = 0;
                    }

                    $scope.st = { 'background': 'rgba(255, 255, 255,' + _op + ')' };
                    $scope.$apply();

                }, false);

                body.addEventListener('touchend',function(e){
                  if(!body.scrollTop){
                    $scope.st = { 'background': 'rgba(255, 255, 255, 0)' };
                    $scope.$apply();
                  }
                },false)
            }();
        }
    }
}]);
