'use strict';
angular.module('app').controller('mainCtrl', ['getData', 'dataTools', 'dict', 'cache', '$scope', '$q', '$state', '$http', function(getData, dataTools, dict, cache, $scope, $q, $state, $http) {
    $scope.visible = false;
    $scope.chooseCity = false;
    $scope.bgClass = 'sunny';
    dict.pageAnimate.status = 'next';
    getData.prom();
    $scope.searchInfo = {
        status: false, //搜索状态
        word: '', //输入关键词
        search: function(str) {
            //获取搜索结果
            if (str) {
                $scope.searchInfo.status = true;
                $http.get('data/city.json?city=' + str).then(function(resp) {
                    $scope.searchInfo.result = getResult(resp.data, str);
                });

                function getResult(list, str) {
                    var result = [];
                    angular.forEach(list, function(item) {
                        var isEqual = true;
                        if (item.cityEn == str || item.cityZh == str) {
                            isEqual = true;
                            result.push(item);
                        } else {
                            isEqual = false;
                        }
                    });
                    return result;
                }
            }
        },
        result: []
    };
    //获取热门城市
    $scope.getHotCity = function() {
        $http.get('data/hotCity.json').then(function(resp) {
            $scope.hotList = resp.data;
        });
    };


    $scope.location = {
        name: '定位中', //定位信息
        id: ''
    };
    var ip = dict.ip;

    //检查是否满足更新数据条件:更新时间和是否已获得数据
    if (dataTools.canUpdate(dict.list, cache.get('update'))) {
        if (ip) {
            $scope.getWeatherInfo(ip);
        } else {
            getLocation().then(function() {
                $scope.getWeatherInfo(ip);
            });

        }
    } else {
        $scope.list = dict.list; //保存当前数据到全局，避免重复请求
        addData($scope.list); //为数据做相关处理
    }

    function getLocation() { //异步请求，避免未获得ip就请求天气
        var def = $q.defer();
        $http.get('http://ip-api.com/json').then(function(resp) {
            ip = resp.data.query;

            def.resolve(resp);

        }).catch(function(err) {
            $scope.location.name = '定位失败，请手动定位';
            def.reject(err);

        });

        return def.promise;
    }
    $scope.getWeatherInfo = function(yourcity) {
        $http.get('https://free-api.heweather.com/v5/weather?city=' + yourcity + '&key=2c111e7218dd4ed8a79564a3c4f58144').then(function(resp) {

            dict.ip = yourcity;
            addData(resp.data.HeWeather5[0]);
        });
    }

    //处理相关数据
    function addData(data) {
        var daily = {
            date: [],
            tmp: {
                series: ['最高温', '最低温'],
                hTmp: [],
                lTmp: []
            },
            wind: []

        }; //存放未来几日预报
        var _date = new Date();
        $scope.list = data;
        dict.list = $scope.list;
        $scope.location.name = $scope.list.basic.city;
        $scope.location.id = $scope.list.basic.id;
        $scope.update = '更新于' + $scope.list.basic.update.loc.split(' ')[1];
        $scope.forecast = $scope.list.daily_forecast;

        $scope.bgClass = dataTools.codeToClass($scope.list.now.cond.code); //根据天气code返回相应的class

        //格式化更新日期，并保存与cookies中
        _date = _date.getFullYear() + ' ' + _date.getMonth() + ' ' + _date.getDay() + ' ' + _date.getHours() + ' ' + _date.getMinutes();
        cache.put('update', _date);

        //将相应日期天气code转为class，并将数据中日期做相应格式化操作
        for (var i = 0, _len = $scope.forecast.length; i < _len; i++) {
            $scope.list.daily_forecast[i].className = dataTools.codeToClass($scope.list.daily_forecast[i].cond.code_d);
            $scope.forecast[i].date_s = dataTools.splitDate('mm-dd', $scope.forecast[i].date, '-', '/');
        }

        //设置天气背景，目前只有sunny和shower-rain，待完善
        if ($scope.bgClass === 'sunny' || $scope.bgClass === 'few-clouds') {
            $scope.bgClass = 'sunny';
        } else {
            $scope.bgClass = 'shower-rain';
        }

        //canvas图表所需相关数据
        var _list = $scope.list.daily_forecast;
        var _len = $scope.list.daily_forecast.length;
        var _tmp = []; //温度

        for (var i = 0; i < _len; i++) {
            daily.date.push(dataTools.splitDate('mm-dd', _list[i].date, '-'));
            daily.tmp.hTmp.push(_list[i].tmp.max);
            daily.tmp.lTmp.push(_list[i].tmp.min);
            daily.wind.push(_list[i].wind.sc);
        }
        _tmp = [daily.tmp.hTmp, daily.tmp.lTmp];
        drawChart(daily.date, daily.tmp.series, _tmp);
    }

    /**
     * angular-chart.js,参考http://jtblin.github.io/angular-chart.js
     * @param {*} labels x轴标签名/arry
     * @param {*} series 坐标系名/arry
     * @param {*} data  y轴值/arry
     */
    function drawChart(labels, series, data) {
        $scope.labels = labels;
        $scope.series = series;
        $scope.data = data;
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
            scales: {
                yAxes: [{
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };
    }
}]);