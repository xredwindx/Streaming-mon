/**
 * Created by ??? on 2017-12-29.
 * 비밀번호 변경
 */
routeApp.controller("pwdChangeCtrl", function ($scope, $http) {
    // init
    $scope.init = function () {
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
        $scope.initial = {
            current : "",
            new : "",
            confirm : ""
        };

        $scope.pwd = angular.copy($scope.initial);
    }
    $scope.init();

    // 처리 메시지
    $scope.alertHandling = function (alertMsg, alertType) {
        $scope.alertClass = ["alert"];

        if(alertType == "success") {
            $scope.alertClass.push("alert-success");
        } else {
            $scope.alertClass.push("alert-danger");
        }

        $scope.defaultAlert = true;
        $scope.alertMsg = alertMsg;
    }

    // enter 키
    $scope.enterEvent = function ($event) {
        if($event.keyCode == 13) {
            $scope.pwdChange();
        }
    }

    // 비밀번호 validation
    $scope.pwdValidator = function () {
        var regexp = /^(?=.*\d)(?=.*[a-zA-Z]).*$/

        if (angular.isUndefined($scope.pwd.current) || $scope.pwd.current.trim() == "") {
            $scope.curAlert = true;
            $scope.curAlertMsg = "현재 비밀번호 입력해주세요";
            return true;
        } else {
            $scope.curAlert = false;
        }

        if(angular.isUndefined($scope.pwd.new) || $scope.pwd.new.trim() == "") {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "새 비밀번호 입력해주세요";
            return true;
        } else {
            $scope.pwdAlert = false;
        }
        if($scope.pwd.new.trim().length < 8) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호는 최소 8자만 입력가능합니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }
        if(!regexp.test($scope.pwd.new.trim())) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호 형식이 잘못되었습니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }

        if(angular.isUndefined($scope.pwd.confirm) || $scope.pwd.confirm.trim() == "") {
            $scope.cPwdAlert = true;
            $scope.cPwdAlertMsg = "비밀번호 확인 입력해주세요";
            return true;
        } else {
            $scope.cPwdAlert = false;
        }
        if ($scope.pwd.new != $scope.pwd.confirm) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "새 비밀번호와 비밀번호 확인이 다릅니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }

        return false;
    }

    // 비밀번호 변경
    $scope.pwdChange = function () {
        if($scope.pwdValidator()) {
            return;
        }

       $http({
           method: "POST",
           url: "/api/pwdChange",
           headers: {
               "Content-Type": "application/json"
           },
           data: { "uid": $scope.userID, "curPwd": $scope.pwd.current, "newPwd": $scope.pwd.new }
       }).then(function success (res) {
           if(res.data == 0) {
               $scope.alertHandling("비밀번호 변경 실패하였습니다", "danger");
           } else {
               $scope.alertHandling("비밀번호 변경 성공하였습니다", "success");
               $scope.pwd = angular.copy($scope.initial);
           }
       }, function error (error) {
           $scope.alertHandling("에러가 발생하였습니다", "danger");
       });
    }
});