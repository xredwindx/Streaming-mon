/**
 * Created by ??? on 2018-01-09.
 * streaming monitor
 */
routeApp.controller("streamingCtrl", function ($scope, $http, $interval, $window, $uibModal) {
    // init
    $scope.init = function () {
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
        $scope.telcoGubun = userInfo.telco_gubun;
        $scope.getStreamingList();
        $scope.getStreamingCheckedList();
    }

    // 장애 처리 메세지
    $scope.streamingAlertHandling = function (alertMsg, alertType) {
        $scope.streamingAlertClass = ["alert"];

        if(alertType == "success") {
            $scope.streamingAlertClass.push("alert-success");
        } else {
            $scope.streamingAlertClass.push("alert-danger");
        }

        $scope.streamingAlert = true;
        $scope.streamingAlertMsg = alertMsg;
    }

    // 점검 처리 메세지
    $scope.streamingCheckedAlertHandling = function (alertMsg, alertType) {
        $scope.streamingCheckedAlertClass = ["alert"];

        if(alertType == "success") {
            $scope.streamingCheckedAlertClass.push("alert-success");
        } else {
            $scope.streamingCheckedAlertClass.push("alert-danger");
        }

        $scope.streamingCheckedAlert = true;
        $scope.streamingCheckedAlertMsg = alertMsg;
    }

    // 장애 목록
    $scope.getStreamingList = function () {
        $http({
            method: "POST",
            url: "/api/streaming",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "telcoGubun" : $scope.telcoGubun, "checkedYn" : "N" }
        }).then(function success (res) {
            $scope.streamingList = res.data;
            $scope.streamingAlert = false;
            $scope.soundAlert();
        }, function error (error) {
            $scope.streamingAlertHandling("에러가 발생하였습니다", "danger");
        });
    }

    // 점검 목록
    $scope.getStreamingCheckedList = function () {
        $http({
            method: "POST",
            url: "/api/streaming",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "telcoGubun" : $scope.telcoGubun, "checkedYn" : "Y" }
        }).then(function success (res) {
            $scope.streamingCheckedList = res.data;
            $scope.streamingCheckedAlert = false;
        }, function error (error) {
            $scope.streamingCheckedAlertHandling("에러가 발생하였습니다", "danger");
        });
    }

    // 소리 알림
    $scope.soundAlert = function () {
        var alertCheck = false;
        for (var i=0 ; i < $scope.streamingList.length ; i++) {
            var item = $scope.streamingList[i];
            if(item.mon_level == "Error" || item.mon_level == "Critical") {
                alertCheck = true;
                break;
            }
        }

        if ( alertCheck ) {
            var alertAudio = new Audio("/static/util/Alert.mp3");
            alertAudio.play();
        }
    }

    // init
    $scope.init();

    $scope.getBgColor = function (item) {
        var ret = "danger";
        if(item == "Warning") {
            ret = "active";
        } else if (item == "Error") {
            ret = "warning";
        }
        return ret;
    }

    $scope.history = function () {
        $window.open("/streaming/history","_blank");
    }

    // 점검 및 해제
    $scope.checkedListYN = function (item, checkedYn) {
        $http({
            method: "POST",
            url: "/api/streaming/check",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : item.service, "hostName" : item.host_name, "serverType" : item.server_type,
                "volume" : item.volume, "streamName" : item.stream_name, "monStatus" : item.mon_status,
                "checkedYn" : checkedYn, "updUser" : $scope.userID }
        }).then(function success (res) {
            $scope.init();
        }, function error (error) {
            $scope.streamingAlertHandling("에러가 발생하였습니다", "danger");
        });
    }

    // 삭제
    $scope.delete = function (item) {
        $http({
            method: "POST",
            url: "/api/streaming/delete",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : item.service, "hostName" : item.host_name, "serverType" : item.server_type,
                "volume" : item.volume, "streamName" : item.stream_name, "monStatus" : item.mon_status,
                "updUser" : $scope.userID }
        }).then(function success (res) {
            $scope.init();
        }, function error (error) {
            $scope.streamingAlertHandling("에러가 발생하였습니다", "danger");
        });
    }

    // modal play
    $scope.play = function (item) {
        var playModalIns = $uibModal.open({
            templateUrl: "/streaming/modalPlay",
            controller: "playModalCtrl",
            resolve : {
                item : function () {
                    return item;
                }
            }
        });

        playModalIns.result.then(function () {});
    }

    // refresh
    $interval(function () { $scope.init(); }, 60*1000);
});

/**
 *  play
 */
routeApp.controller("playModalCtrl", function ($scope, $rootScope, $sce, $uibModalInstance, item) {
    // init
    $scope.init = function () {
        $scope.hostName = item.host_name;
        $scope.vol = item.volume;
        $scope.streamName = item.stream_name;
        $scope.streamUrl = "http://"+$scope.hostName+":1935/"+$scope.vol+"/"+$scope.streamName+"/playlist.m3u8";
    }
    $scope.init();

    $scope.ok = function () {
        $uibModalInstance.close();
    }

});