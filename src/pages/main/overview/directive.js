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