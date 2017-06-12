'use strict';
angular.module('app',['ui.router','ngCookies','chart.js','ngAnimate']);
'use strict';
angular.module('app').config(['ChartJsProvider',function(ChartJsProvider){
   ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
}]);
'use strict';
angular.module('app').value('dict', {
    pageAnimate: {
        status: 'next' //页面过渡状态
    },
    index: {
        city: '',
        cityId: '',
        weather: '',
        cont: ''
    },
    ip: '',
    list: ''
});
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


'use strict';
angular.module('app').service('cache',['$cookies',function($cookies){
    this.put=function(key,value){
        $cookies.put(key,value);
    };
    this.get=function(key){
       return $cookies.get(key);
    };
    this.remove=function(key){
       return $cookies.remove(key);
    }
}]);
'use strict';
angular.module('app').service('dataTools', function() {
    /**
     *
     * @param {*} option string 指定返回的形式,'-'隔开 :yy,mm,dd,mm-dd,dd-mm
     * @param {*} date string 值:yy-mm-dd
     * @param {*} s string 指定分割符
     */
    this.splitDate = function(option, date, s) {
        var _option = option.split('-');
        var _date = date.split(s);
        var _l = _option.length;
        if (_l == 1) {
            switch (_option) {
                case 'yy':
                    return _date[0];
                case 'dd':
                    return _date[2];
                case 'mm':
                    return _date[1];
            }
        } else if (_l == 2) {
            switch (option) {
                case 'mm-dd':
                    return _date.splice(1).join('-');
                case 'dd-mm':
                    return _date.reverse().splice(1).join('-');
            }
        }
    };
    this.reformatData = function(data) {
        var _sug = [];
        var _len = 0;
        if (data.suggestion) {
            // data.suggestion.air.id = "air";
            // data.suggestion.air.name = "空气指数";
            // data.suggestion.air.img = "image/icon/pm25.png";
            // _sug.push(data.suggestion.air);
            data.suggestion.comf.id = "comf";
            data.suggestion.comf.name = "体感温度";
            data.suggestion.comf.img = "image/icon/tmp.png";
            _sug.push(data.suggestion.comf);
            data.suggestion.cw.id = "cw";
            data.suggestion.cw.name = "洗车指数";
            data.suggestion.cw.img = "image/icon/car.png";
            _sug.push(data.suggestion.cw);
            data.suggestion.drsg.id = "drsg";
            data.suggestion.drsg.name = "穿衣指数";
            data.suggestion.drsg.img = "image/icon/cloth.png";
            _sug.push(data.suggestion.drsg);
            data.suggestion.flu.id = "flu";
            data.suggestion.flu.name = "感冒指数";
            data.suggestion.flu.img = "image/icon/flur.png";
            _sug.push(data.suggestion.flu);
            data.suggestion.sport.id = "sport";
            data.suggestion.sport.name = "运动指数";
            data.suggestion.sport.img = "image/icon/sport.png";
            _sug.push(data.suggestion.sport);
            data.suggestion.trav.id = "trav";
            data.suggestion.trav.name = "旅游指数";
            data.suggestion.trav.img = "image/icon/tra.png";
            _sug.push(data.suggestion.trav);
            data.suggestion.uv.id = "uv";
            data.suggestion.uv.name = "紫外线指数";
            data.suggestion.uv.img = "image/icon/spf.png";
            _sug.push(data.suggestion.uv);
            _len = 3 - _sug.length % 3;
            if (_len) {
                for (var i = 0; i < _len; i++) {
                    _sug.push('');
                }
            }
        }
        return data;
    };
    this.canUpdate = function(obj, d) {
        if (obj) {
            if (d) { //是否有更新日期,有则比较时间是否一致,否则可返回true;
                var _now = new Date();
                console.log(d, _now);
                d = d.split(' ');
                if (_now.getFullYear() - d[0]) {
                    console.log('更新时间大于一年');
                    return true;
                }
                if (_now.getMonth() - d[1]) {
                    console.log('更新时间大于一个月');
                    return true;
                }
                if (_now.getDay() - d[2]) {
                    console.log('更新时间大于一天');
                    return true;
                }
                if (_now.getHours() - d[3]) {
                    console.log('更新时间大于一小时');
                    return true;
                }
                if (_now.getMinutes() - d[4] > 5) {
                    console.log('更新时间大于五分钟');
                    return true;
                } else {
                    console.log('有时间有数据，小于五分钟');
                    return false;
                }
            } else {
                console.log('没有记录更新时间');
                return true;
            }
        } else {
            console.log('没有天气数据');
            return true;
        }
    };
    this.codeToClass = function(code) {
        switch (code) {
            case '100':
                return 'sunny'; //晴
            case '101':
                return 'cloudy'; //多云
            case '102':
                return 'few-clouds'; //少云
            case '103':
                return 'partly-cloudy'; //晴间多云
            case '104':
                return 'overcast'; //阴
            case '200':
                return 'windy'; //有风
            case '201':
                return 'calm'; //平静
            case '202':
                return 'light-breeze'; //微风
            case '203':
                return 'moderate'; //和风
            case '204':
                return 'fresh-breeze'; //清风
            case '205':
                return 'strong-breeze'; //强风
            case '206':
                return 'high-wind'; //疾风
            case '207':
                return 'gale'; //大风
            case '208':
                return 'strong-gale'; //烈风
            case '209':
                return 'storm'; //风暴
            case '210':
                return 'violent-storm'; //狂爆风
            case '211':
                return 'hurricane'; //飓风
            case '212':
                return 'tornado'; //龙卷风
            case '213':
                return 'tropical-storm'; //热带风暴
            case '300':
                return 'shower-rain'; //雷阵雨
            case '301':
                return 'hshower-rain'; //雷阵雨
            case '302':
                return 'thunder-shower'; //雷阵雨
            case '303':
                return 'heavy-thunderstorm'; //强雷阵雨
            case '304':
                return 'hail'; //雷阵雨伴有冰雹
            case '305':
                return 'light-rain'; //小雨
            case '306':
                return 'moderate-rain'; //中雨
            case '307':
                return 'heavy-rain'; //大雨
            case '308':
                return 'extreme-rain'; //极端降雨
            case '309':
                return 'drizzle-rain'; //毛毛雨
            case '310':
                return 'storm'; //暴雨
            case '311':
                return 'heavy-storm'; //暴雨
            case '312':
                return 'severe-storm'; //暴雨
            case '313':
                return 'freezing-storm'; //暴雨
            case '400':
                return 'light-snow'; //小雪
            case '401':
                return 'moderate-snow'; //中雪
            case '402':
                return 'heavy-snow'; //大雪
            case '403':
                return 'snowstorm'; //暴雪
            case '404':
                return 'sleet'; //雨夹雪
            case '405':
                return 'rain-and-snow'; //雨雪天气
            case '406':
                return 'shower-snow'; //阵雨夹雪
            case '407':
                return 'snow-flurry'; //阵雪
            case '500':
                return 'light-snow'; //小雪
            case '501':
                return 'moderate-snow'; //中雪
            case '502':
                return 'mist'; //薄雾
            case '503':
                return 'foggy'; //雾
            case '504':
                return 'haze'; //霾
            case '505':
                return 'sand'; //扬沙
            case '506':
                return 'dust'; //浮尘
            case '507':
                return 'duststorm'; //沙尘暴
            case '508':
                return 'sandstorm'; //强沙尘暴
            case '900':
                return 'hot'; //热
            case '901':
                return 'cold'; //冷
            case '999':
                return 'unknown'; //未知
            case 'undefine':
                return 'unknown';
            case '':
                return 'unknown';
            default:
                return 'rainy';
        };
    }
});
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
'use strict';
angular.module('app').controller('cityCtrl',['$http','$scope',function($http,$scope){
   
}]);
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

'use strict';
angular.module('app').controller('canvasCtrl',['$scope',function($scope){
    
}]);
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
'use strict';
angular.module('app').directive('appOverView',[function(){
    return{
        restrict:'A',
        replace:true,
        templateUrl:'pages/overview/overview.html',
        scope:{
            list:'='
        }
    }
}])