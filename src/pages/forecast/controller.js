'use strcit';
angular.module('app').controller('forecastCtrl', ['dataTools', 'dict', '$q', 'cache', '$http', '$scope', function(dataTools, dict, $q, cache, $http, $scope) {
    var ip = dict.ip;
    $scope.bgClass = '';
    if (ip) {
        getWeather(ip);
    } else {
        getIp().then(function() {
            getWeather(ip);
        });

    }

    function getIp() {
        var def = $q.defer();
        $http.get('http://ip-api.com/json').then(function(resp) {
            ip = resp.data.query;
            def.resolve(resp);
        }).catch(function(err) {
            def.reject(err);
        });
        return def.promise;
    }

    function getWeather(IP) {
        $http.get('https://free-api.heweather.com/v5/weather?city=' + IP + '&key=2c111e7218dd4ed8a79564a3c4f58144').then(function(resp) {
            $scope.list = resp.data.HeWeather5[0].daily_forecast;
            $scope.bgClass = dataTools.codeToClass(resp.data.HeWeather5[0].now.cond.code);
            if ($scope.bgClass === 'sunny' || $scope.bgClass === 'few-clouds') {
                $scope.bgClass = 'sunny';
            } else {
                $scope.bgClass = 'shower-rain';
            }
            for (var i = 0, _len = $scope.list.length; i < _len; i++) {
                $scope.list[i].className = dataTools.codeToClass($scope.list[i].cond.code_d);
                $scope.list[i].date_s = dataTools.splitDate('mm-dd', $scope.list[i].date, '-', '/');
            }

        });
    }
}])