'use strict';
angular.module('app').controller('detailCtrl', ['dataTools', 'dict', '$q', 'cache', '$scope', '$http', '$state', function(dataTools, dict, $q, cache, $scope, $http, $state) {
    var ip = dict.ip;
    var update = cache.get('update');
    $scope.anInfo = { //页面过渡状态
        pageAn: dict.pageAnimate.status
    };

    /**
     * @param:pageAn
     * a:通过是否为空值设置相应的页面过渡状态 空:next,非空:pre
     */
    $scope.pageAn = function(a) {
        if (a) {
            dict.pageAnimate.status = 'pre';
        } else {
            dict.pageAnimate.status = 'next';
        }
    };

    if (dataTools.canUpdate(dict.list, update)) {
        if (ip) {
            getWeather(ip);
        } else {
            getIp().then(function() {
                getWeather(ip);
            });

        }
    } else {
        addData(dict.list, ip);
    }

    $scope.goBack = function() {
            window.history.back();
        }
        /**
         * a:当前点击的元素的值，判断a是否为空，防止空元素被点击时跳转
         */
    $scope.getName = function(a) {

        if (a) {
            dict.cont = a;
            dict.weather = {
                text: $scope.list.now.cond.txt,
                tmp: $scope.list.daily_forecast[0].tmp.max + '~' + $scope.list.daily_forecast[0].tmp.min + '℃',
                wind: $scope.list.now.wind
            };
            dict.city = $scope.list.basic.city;
            dict.cityId = $scope.list.basic.id;
            $state.go('index', { id: a.id })
        }

    };

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
            addData(resp.data.HeWeather5[0], IP)
        });
    }

    function addData(obj, IP) {
        var _date = '';
        $scope.list = dataTools.reformatData(obj);
        $scope.ip = IP;

        update = new Date();
        $scope.weatherClass = dataTools.codeToClass(obj.now.cond.code);
        _date = update.getFullYear() + ' ' + update.getMonth() + ' ' + update.getDay() + ' ' + update.getHours() + ' ' + update.getMinutes();
        cache.put('update', _date);
        $scope.list.hourly_forecast = checkLength($scope.list.hourly_forecast);

        for (var i = 0, _len = $scope.list.daily_forecast.length; i < _len; i++) {
            $scope.list.hourly_forecast[i].className = dataTools.codeToClass($scope.list.hourly_forecast[i].cond.code);
            $scope.list.hourly_forecast[i].date_s = $scope.list.hourly_forecast[i].date.split(' ')[1];
        }
        console.log($scope.list.hourly_forecast);
        dict.list = $scope.list;
    }

    /**
     * //小时预报数据长度为三个，截至晚上十二点，晚上十点和十一点会出现数据不足三个，需补足剩余数据
     * @param {*} arr arry
     */
    function checkLength(arr) {

        var _hlength = 3 - arr.length;
        if (_hlength > -1) {
            var _item = {
                cond: {
                    code: "999",
                    txt: "未知"
                },
                date: "0 -",
                hum: "NA",
                pop: "NA",
                pres: "NA",
                tmp: "NA",
                wind: {
                    deg: "NA",
                    dir: "NA",
                    sc: "NA",
                    spd: "NA"
                }
            };
            for (var i = 0; i < _hlength; i++) {
                arr.push(_item);
            }
        }
        return arr.splice(0, 3);
    }


}]);