'use strict';
angular.module('app').service('getData', ['$q', '$http', function($q, $http) {
    this.getLocation = function() {

        $http.get('http://ip-api.com/json').then(function(resp) {
            return resp.data.query;
        });
    };
    this.getWeather = function(city) {
        $http.get('https://free-api.heweather.com/v5/weather?city=' + city + '&key=2c111e7218dd4ed8a79564a3c4f58144').then(function(resp) {

            return resp.data;
        });
    };
    this.prom = function() {
        var _ip;
        var _gw = this.getWeather;

        function _getLocation() {
            var _def = $q.defer();
            $http.get('http://ip-api.com/json').then(function(_resp) {
                _def.resolve(_resp);
                _ip = resp.data.query;
            }).catch(function(err) {
                _def.reject(err);
            });
            return _def.promise;
        };
        _getLocation().then(function() {
            _gw(_ip);
        })
    }


}]);