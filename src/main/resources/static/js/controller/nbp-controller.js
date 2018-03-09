/**
 * Created by ??? on 2018-01-09.
 * nbp monitor
 */
routeApp.controller("nbpCtrl", function ($scope, $http, $filter, $interval, $window) {
    // init
    $scope.init = function () {
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if(userInfo.telco_gubun == "LG" || userInfo.telco_gubun == "All") {
            $scope.nbpShow = true;

            var curDate = new Date();
            $scope.curDateYmd = $filter("date")(curDate, "yyyyMMdd");

            $http({
                method: "POST",
                url: "/api/nbp",
                headers: {
                    "Content-Type": "application/json"
                },
                data: { "now": $scope.curDateYmd }
            }).then(function success (res) {
                $scope.nbpList = $scope.nbpDataCustom(res.data, curDate);
                $scope.nbpAlert = false;
            }, function error (error) {
                $scope.nbpAlertHandling("에러가 발생하였습니다", "danger");
            });
        }
    }

    $scope.dateParse = function (str) {
        var y = str.substring(0,4);
        var m = str.substring(4,6);
        var d = str.substring(6,8);
        var h = str.substring(8,10);
        var mm = str.substring(10,12);
        var s = str.substring(12,14);

        return new Date(y,m-1,d,h,mm,s);
    }

    $scope.dateParse2 = function (str) {
        var y = str.substring(0,4);
        var m = str.substring(5,7);
        var d = str.substring(8,10);
        var h = str.substring(11,13);
        var mm = str.substring(14,16);
        var s = str.substring(17,19);

        return new Date(y,m-1,d,h,mm,s);
    }

    // 처리 메세지
    $scope.nbpAlertHandling = function (alertMsg, alertType) {
        $scope.nbpAlertClass = ["alert"];

        if(alertType == "success") {
            $scope.nbpAlertClass.push("alert-success");
        } else {
            $scope.nbpAlertClass.push("alert-danger");
        }

        $scope.nbpAlert = true;
        $scope.nbpAlertMsg = alertMsg;
    }

    $scope.nbpDataCustom = function (nbpData, curDate) {
        var nbpList = [];
        var dateNowStr = $filter("date")(curDate, "yyyyMMddHHmmss");
        var dateNow = $scope.dateParse(dateNowStr);

        angular.forEach(nbpData, function (value, key) {
            var start_time = $scope.dateParse2(value.start_time);
            var readyTime = angular.copy(start_time);
            readyTime.setMinutes(readyTime.getMinutes() - 30);
            var end_time = $scope.dateParse2(value.end_time);
            var finishTime = angular.copy(end_time);
            finishTime.setHours(finishTime.getHours() + 1);

            if(dateNow >= start_time && dateNow < end_time) {
                nbpList.push({"channel_name":value.channel_name, "title":value.title, "corporator":value.corporator,
                "start_time":value.start_time, "end_time":value.end_time, "bg":"danger", "status":"Live"});
            } else if(dateNow >= readyTime && dateNow < start_time) {
                nbpList.push({"channel_name":value.channel_name, "title":value.title, "corporator":value.corporator,
                    "start_time":value.start_time, "end_time":value.end_time, "bg":"info", "status":"Ready"});
            } else if(dateNow > end_time && dateNow < finishTime) {
                nbpList.push({"channel_name":value.channel_name, "title":value.title, "corporator":value.corporator,
                    "start_time":value.start_time, "end_time":value.end_time, "bg":"default", "status":"Finished"});
            }
        });

        return nbpList
    }

    // init
    $scope.init();

    // refresh
    $interval(function () { $scope.init(); }, 60*1000);

    $scope.multiViewer = function () {
        $window.open("/nbp/monitor","_blank");
    }
});