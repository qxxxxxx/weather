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