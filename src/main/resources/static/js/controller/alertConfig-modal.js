/**
 * Created by ??? on 2018-02-07.
 * alert modal
 */
/**
 *  alert 생성
 */
routeApp.controller("addAlertModalCtrl", function ($scope, $uibModalInstance, $http) {
    // init
    $scope.init = function () {
        $scope.initial = {
            telcoGubun : "KT",
            service : "",
            smsUrl : "",
            smsUrlId : "",
            smsUrlPwd : "",
            smsPhone : "",
            smsCallback : "",
            mailUrl : "",
            mailUrlId : "",
            mailUrlPwd : "",
            mailTo : "",
            mailFrom : "",
            alertStart : "5",
            alertInterval : "10"
        };
        $scope.alert = angular.copy($scope.initial);

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    // alert validation
    $scope.alertValidator = function () {
        if(angular.isUndefined($scope.alert.service) || $scope.alert.service.trim() == "") {
            $scope.serviceAlert = true;
            $scope.serviceAlertMsg = "Service 입력해주세요";
            return true;
        } else {
            $scope.serviceAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailUrl) || $scope.alert.mailUrl.trim() == "") {
            $scope.mUrlAlert = true;
            $scope.mUrlAlertMsg = "Mail url 입력해주세요";
            return true;
        } else {
            $scope.mUrlAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailUrlId) || $scope.alert.mailUrlId.trim() == "") {
            $scope.mIdAlert = true;
            $scope.mIdAlertMsg = "Mail url id 입력해주세요";
            return true;
        } else {
            $scope.mIdAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailUrlPwd) || $scope.alert.mailUrlPwd.trim() == "") {
            $scope.mPwdAlert = true;
            $scope.mPwdAlertMsg = "Mail url pwd 입력해주세요";
            return true;
        } else {
            $scope.mPwdAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailTo) || $scope.alert.mailTo.trim() == "") {
            $scope.mToAlert = true;
            $scope.mToAlertMsg = "Mail to 입력해주세요";
            return true;
        } else {
            $scope.mToAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailFrom) || $scope.alert.mailFrom.trim() == "") {
            $scope.mFromAlert = true;
            $scope.mFromAlertMsg = "Mail from 입력해주세요";
            return true;
        } else {
            $scope.mFromAlert = false;
        }
        if(angular.isUndefined($scope.alert.alertStart) || $scope.alert.alertStart.trim() == "") {
            $scope.startAlert = true;
            $scope.startAlertMsg = "Start 입력해주세요";
            return true;
        } else {
            $scope.startAlert = false;
        }
        if(angular.isUndefined($scope.alert.alertInterval) || $scope.alert.alertInterval.trim() == "") {
            $scope.intervalAlert = true;
            $scope.intervalAlertMsg = "Interval 입력해주세요";
            return true;
        } else {
            $scope.intervalAlert = false;
        }

        return false;
    }

    $scope.addAlert = function () {
        if($scope.alertValidator()) {
            return;
        }

        $http({
            method: "POST",
            url: "/api/alert/add",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "telco" : $scope.alert.telcoGubun, "service" : $scope.alert.service, "smsUrl" : $scope.alert.smsUrl,
                "smsUrlId" : $scope.alert.smsUrlId,  "smsUrlPwd" : $scope.alert.smsUrlPwd, "smsPhone" : $scope.alert.smsPhone,
                "smsCallback" : $scope.alert.smsCallback, "mailUrl" : $scope.alert.mailUrl, "mailUrlId" : $scope.alert.mailUrlId,
                "mailUrlPwd" : $scope.alert.mailUrlPwd, "mailTo" : $scope.alert.mailTo, "mailFrom" : $scope.alert.mailFrom,
                "alertStart" : $scope.alert.alertStart, "alertInterval" : $scope.alert.alertInterval, "regUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "sms, email 생성이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "sms, email 생성 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  alert 삭제
 */
routeApp.controller("delAlertModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.modalService = id;
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    $scope.ok = function () {
        $http({
            method: "POST",
            url: "/api/alert/del",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : id, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "sms, email 삭제가 실패하였습니다";
            } else {
                $uibModalInstance.close(id);
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "sms, email 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  alert 수정
 */
routeApp.controller("editAlertModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.chkEdit = false;
        $scope.initial = {
            telcoGubun : "KT",
            service : "",
            smsUrl : "",
            smsUrlId : "",
            smsUrlPwd : "",
            smsPhone : "",
            smsCallback : "",
            mailUrl : "",
            mailUrlId : "",
            mailUrlPwd : "",
            mailTo : "",
            mailFrom : "",
            alertStart : "5",
            alertInterval : "10"
        };

        $http({
            method: "POST",
            url: "/api/alert/get",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : id }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "sms, email 정보 조회가 실패하였습니다.";
            } else {
                $scope.alert = angular.copy($scope.initial);
                $scope.alert.service = res.data.service;
                $scope.alert.telcoGubun = res.data.telco_gubun;
                $scope.alert.smsUrl = res.data.sms_url;
                $scope.alert.smsUrlId = res.data.sms_url_id;
                $scope.alert.smsUrlPwd = res.data.sms_url_pwd;
                $scope.alert.smsPhone = res.data.sms_phone;
                $scope.alert.smsCallback = res.data.sms_callback;
                $scope.alert.mailUrl = res.data.mail_url;
                $scope.alert.mailUrlId = res.data.mail_url_id;
                $scope.alert.mailUrlPwd = res.data.mail_url_pwd;
                $scope.alert.mailTo = res.data.mail_to;
                $scope.alert.mailFrom = res.data.mail_from;
                $scope.alert.alertStart = res.data.alert_start+"";
                $scope.alert.alertInterval = res.data.alert_interval+"";
                $scope.chkEdit = true;
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "sms, email 에러가 발생하였습니다";
        });

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    // alert validation
    $scope.alertValidator = function () {
        if(angular.isUndefined($scope.alert.mailUrl) || $scope.alert.mailUrl.trim() == "") {
            $scope.mUrlAlert = true;
            $scope.mUrlAlertMsg = "Mail url 입력해주세요";
            return true;
        } else {
            $scope.mUrlAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailUrlId) || $scope.alert.mailUrlId.trim() == "") {
            $scope.mIdAlert = true;
            $scope.mIdAlertMsg = "Mail url id 입력해주세요";
            return true;
        } else {
            $scope.mIdAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailUrlPwd) || $scope.alert.mailUrlPwd.trim() == "") {
            $scope.mPwdAlert = true;
            $scope.mPwdAlertMsg = "Mail url pwd 입력해주세요";
            return true;
        } else {
            $scope.mPwdAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailTo) || $scope.alert.mailTo.trim() == "") {
            $scope.mToAlert = true;
            $scope.mToAlertMsg = "Mail to 입력해주세요";
            return true;
        } else {
            $scope.mToAlert = false;
        }
        if(angular.isUndefined($scope.alert.mailFrom) || $scope.alert.mailFrom.trim() == "") {
            $scope.mFromAlert = true;
            $scope.mFromAlertMsg = "Mail from 입력해주세요";
            return true;
        } else {
            $scope.mFromAlert = false;
        }
        if(angular.isUndefined($scope.alert.alertStart) || $scope.alert.alertStart.trim() == "") {
            $scope.startAlert = true;
            $scope.startAlertMsg = "Start 입력해주세요";
            return true;
        } else {
            $scope.startAlert = false;
        }
        if(angular.isUndefined($scope.alert.alertInterval) || $scope.alert.alertInterval.trim() == "") {
            $scope.intervalAlert = true;
            $scope.intervalAlertMsg = "Interval 입력해주세요";
            return true;
        } else {
            $scope.intervalAlert = false;
        }

        return false;
    }

    $scope.editAlert = function () {
        if($scope.alertValidator()) {
            return;
        }

        $http({
            method: "POST",
            url: "/api/alert/edit",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "telco" : $scope.alert.telcoGubun, "service" : $scope.alert.service, "smsUrl" : $scope.alert.smsUrl,
                "smsUrlId" : $scope.alert.smsUrlId,  "smsUrlPwd" : $scope.alert.smsUrlPwd, "smsPhone" : $scope.alert.smsPhone,
                "smsCallback" : $scope.alert.smsCallback, "mailUrl" : $scope.alert.mailUrl, "mailUrlId" : $scope.alert.mailUrlId,
                "mailUrlPwd" : $scope.alert.mailUrlPwd, "mailTo" : $scope.alert.mailTo, "mailFrom" : $scope.alert.mailFrom,
                "alertStart" : $scope.alert.alertStart, "alertInterval" : $scope.alert.alertInterval, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "sms, email 수정이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "sms, email 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  telegram 생성
 */
routeApp.controller("addTelegramModalCtrl", function ($scope, $uibModalInstance, $http) {
    // init
    $scope.init = function () {
        $scope.initial = {
            service : "",
            streamDomain : "",
            jwtSecretKey : "",
            telegramApiKey : "",
            telegramChatId : ""
        };
        $scope.telegram = $scope.initial;

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    // telegram validation
    $scope.telegramValidator = function () {
        if(angular.isUndefined($scope.telegram.service) || $scope.telegram.service.trim() == "") {
            $scope.tServiceAlert = true;
            $scope.tServiceAlertMsg = "Service 입력해주세요";
            return true;
        } else {
            $scope.serviceAlert = false;
        }
        if(angular.isUndefined($scope.telegram.streamDomain) || $scope.telegram.streamDomain.trim() == "") {
            $scope.sdAlert = true;
            $scope.sdAlertMsg = "Stream domain 입력해주세요";
            return true;
        } else {
            $scope.sdAlert = false;
        }
        if(angular.isUndefined($scope.telegram.jwtSecretKey) || $scope.telegram.jwtSecretKey.trim() == "") {
            $scope.jwtAlert = true;
            $scope.jwtAlertMsg = "JWT secret key 입력해주세요";
            return true;
        } else {
            $scope.mIdAlert = false;
        }
        if(angular.isUndefined($scope.telegram.telegramApiKey) || $scope.telegram.telegramApiKey.trim() == "") {
            $scope.tApiKeyAlert = true;
            $scope.tApiKeyAlertMsg = "Telegram api key 입력해주세요";
            return true;
        } else {
            $scope.tApiKeyAlert = false;
        }
        if(angular.isUndefined($scope.telegram.telegramChatId) || $scope.telegram.telegramChatId.trim() == "") {
            $scope.tChatIdAlert = true;
            $scope.tChatIdAlertMsg = "Telegram chat id 입력해주세요";
            return true;
        } else {
            $scope.tChatIdAlert = false;
        }

        return false;
    }

    $scope.addTelegram = function () {
        if($scope.telegramValidator()) {
            return;
        }

        $http({
            method: "POST",
            url: "/api/telegram/add",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : $scope.telegram.service, "streamDomain" : $scope.telegram.streamDomain, "jwtSecretKey" : $scope.telegram.jwtSecretKey,
                "telegramApiKey" : $scope.telegram.telegramApiKey, "telegramChatId" : $scope.telegram.telegramChatId, "regUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "Telegram 생성이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "Telegram 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  telegram 삭제
 */
routeApp.controller("delTelegramModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.modalServiceT = id;
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    $scope.ok = function () {
        $http({
            method: "POST",
            url: "/api/telegram/del",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : id, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "Telegram 삭제가 실패하였습니다";
            } else {
                $uibModalInstance.close(id);
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "Telegram 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  telegram 수정
 */
routeApp.controller("editTelegramModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.chkEdit = false;
        $scope.initial = {
            service : "",
            streamDomain : "",
            jwtSecretKey : "",
            telegramApiKey : "",
            telegramChatId : ""
        };

        $http({
            method: "POST",
            url: "/api/telegram/get",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : id }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "Telegram 조회가 실패하였습니다.";
            } else {
                $scope.telegram = angular.copy($scope.initial);
                $scope.telegram.service = res.data.service;
                $scope.telegram.streamDomain = res.data.stream_domain;
                $scope.telegram.jwtSecretKey = res.data.jwt_secret_key;
                $scope.telegram.telegramApiKey = res.data.telegram_api_key;
                $scope.telegram.telegramChatId = res.data.telegram_chat_id;
                $scope.chkEdit = true;
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "Telegram 에러가 발생하였습니다";
        });

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    // telegram validation
    $scope.telegramValidator = function () {
        if(angular.isUndefined($scope.telegram.streamDomain) || $scope.telegram.streamDomain.trim() == "") {
            $scope.sdAlert = true;
            $scope.sdAlertMsg = "Stream domain 입력해주세요";
            return true;
        } else {
            $scope.sdAlert = false;
        }
        if(angular.isUndefined($scope.telegram.jwtSecretKey) || $scope.telegram.jwtSecretKey.trim() == "") {
            $scope.jwtAlert = true;
            $scope.jwtAlertMsg = "JWT secret key 입력해주세요";
            return true;
        } else {
            $scope.mIdAlert = false;
        }
        if(angular.isUndefined($scope.telegram.telegramApiKey) || $scope.telegram.telegramApiKey.trim() == "") {
            $scope.tApiKeyAlert = true;
            $scope.tApiKeyAlertMsg = "Telegram api key 입력해주세요";
            return true;
        } else {
            $scope.tApiKeyAlert = false;
        }
        if(angular.isUndefined($scope.telegram.telegramChatId) || $scope.telegram.telegramChatId.trim() == "") {
            $scope.tChatIdAlert = true;
            $scope.tChatIdAlertMsg = "Telegram chat id 입력해주세요";
            return true;
        } else {
            $scope.tChatIdAlert = false;
        }

        return false;
    }

    $scope.editTelegram = function () {
        if($scope.telegramValidator()) {
            return;
        }

        $http({
            method: "POST",
            url: "/api/telegram/edit",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "service" : $scope.telegram.service, "streamDomain" : $scope.telegram.streamDomain, "jwtSecretKey" : $scope.telegram.jwtSecretKey,
                "telegramApiKey" : $scope.telegram.telegramApiKey, "telegramChatId" : $scope.telegram.telegramChatId, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "Telegram 수정이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "Telegram 에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});