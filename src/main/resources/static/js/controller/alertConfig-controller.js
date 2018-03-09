/**
 * Created by ??? on 2018-02-01.
 * sms, email, telegram 설정
 */
routeApp.controller("alertConfigCtrl", function ($scope, $http, $uibModal) {
    // init
    $scope.init = function () {
        $scope.initPage = {
            currentPage : 1,
            pageSize : 20,
            totalCount : 0,
            pages : 0
        };

        $scope.searchText = {
            alert : "",
            telegram : "",
        }

        $scope.alertPage = angular.copy($scope.initPage);
        $scope.telegramPage = angular.copy($scope.initPage);

        $scope.getAlertList();
        $scope.getTelegramList();
    }

    $scope.configAlertHandling = function (alertMsg, alertType) {
        $scope.configAlertClass = ["alert"];

        if(alertType == "success") {
            $scope.configAlertClass.push("alert-success");
        } else {
            $scope.configAlertClass.push("alert-danger");
        }

        $scope.configAlert = true;
        $scope.configAlertMsg = alertMsg;
    }

    $scope.telegramAlertHandling = function (alertMsg, alertType) {
        $scope.telegramAlertClass = ["alert"];

        if(alertType == "success") {
            $scope.telegramAlertClass.push("alert-success");
        } else {
            $scope.telegramAlertClass.push("alert-danger");
        }

        $scope.telegramAlert = true;
        $scope.telegramAlertMsg = alertMsg;
    }

    $scope.getAlertList = function () {
        $scope.pgOffset = ($scope.alertPage.currentPage - 1) * $scope.alertPage.pageSize;
        $http({
            method: "POST",
            url: "/api/alertList",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "searchText" : $scope.searchText.alert, "offset" : $scope.pgOffset, "pageSize" : $scope.alertPage.pageSize }
        }).then(function success (res) {
            $scope.configAlert = false;
            $scope.alertList = res.data.alertList;
            $scope.alertPage.totalCount = res.data.totalCount;
            $scope.alertPage.pages = Math.ceil($scope.alertPage.totalCount/$scope.alertPage.pageSize);
        }, function error (error) {
            $scope.configAlertHandling("sms,email tab에 에러가 발생하였습니다", "danger");
        });
    }

    $scope.getTelegramList = function () {
        $scope.pgOffset = ($scope.telegramPage.currentPage - 1) * $scope.telegramPage.pageSize;
        $http({
            method: "POST",
            url: "/api/telegramList",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "searchText" : $scope.searchText.telegram, "offset" : $scope.pgOffset, "pageSize" : $scope.telegramPage.pageSize }
        }).then(function success (res) {
            $scope.telegramAlert = false;
            $scope.telegramList = res.data.telegramList;
            $scope.telegramPage.totalCount = res.data.totalCount;
            $scope.telegramPage.pages = Math.ceil($scope.telegramPage.totalCount/$scope.telegramPage.pageSize);
        }, function error (error) {
            $scope.telegramAlertHandling("telegram tab에 에러가 발생하였습니다", "danger");
        });
    }

    $scope.init();

    // pagination
    $scope.alertPageChanged = function () {
        $scope.getAlertList();
    }
    $scope.telegramPageChanged = function() {
        $scope.getTelegramList();
    }

    // 검색
    $scope.search = function (what) {
        if(what == "alert") {
            $scope.alertPage = angular.copy($scope.initPage);
            $scope.getAlertList();
        } else if(what == "telegram") {
            $scope.telegramPage = angular.copy($scope.initPage);
            $scope.getTelegramList();
        }
    }

    // enter키
    $scope.enterEvent = function ($event, what) {
        if ($event.keyCode == 13) {
            $scope.search(what);
        }
    }

    // modal alert 생성
    $scope.addAlert = function () {
        var addModalIns = $uibModal.open({
            templateUrl: "/alert/modalAddAlert",
            controller: "addAlertModalCtrl"
        });

        addModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.alertPage = angular.copy($scope.initPage);
                $scope.searchText.alert = "";
                $scope.getAlertList();
            }
        });
    }

    // modal alert 삭제
    $scope.delAlert = function (id) {
        var delModalIns = $uibModal.open({
            templateUrl: "/alert/modalDelAlert",
            controller: "delAlertModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        delModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.getAlertList();
            }
        });
    }

    // modal alert 수정
    $scope.editAlert = function (id) {
        var editModalIns = $uibModal.open({
            templateUrl: "/alert/modalEditAlert",
            controller: "editAlertModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        editModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.alertPage = angular.copy($scope.initPage);
                $scope.searchText.alert = "";
                $scope.getAlertList();
            }
        });
    }

    // modal telegram 생성
    $scope.addTelegram = function () {
        var addModalIns = $uibModal.open({
            templateUrl: "/alert/modalAddTelegram",
            controller: "addTelegramModalCtrl"
        });

        addModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.telegramPage = angular.copy($scope.initPage);
                $scope.searchText.telegram = "";
                $scope.getTelegramList();
            }
        });
    }

    // modal telegram 삭제
    $scope.delTelegram = function (id) {
        var delModalIns = $uibModal.open({
            templateUrl: "/alert/modalDelTelegram",
            controller: "delTelegramModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        delModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.getTelegramList();
            }
        });
    }

    // modal telegram 수정
    $scope.editTelegram = function (id) {
        var editModalIns = $uibModal.open({
            templateUrl: "/alert/modalEditTelegram",
            controller: "editTelegramModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        editModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.telegramPage = angular.copy($scope.initPage);
                $scope.searchText.telegram = "";
                $scope.getTelegramList();
            }
        });
    }
});