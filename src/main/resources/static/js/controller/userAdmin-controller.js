/**
 * Created by ??? on 2018-01-04.
 * user 관리
 */
routeApp.controller("userAdminCtrl", function ($scope, $http, $uibModal) {
    // init
    $scope.init = function () {
        $scope.initPage = {
            currentPage : 1,
            pageSize : 20,
            totalCount : 0,
            pages : 0
        };

        $scope.page = angular.copy($scope.initPage);

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
        $scope.searchText = "";
        $scope.getUserList();
    }

    $scope.alertHandling = function (alertMsg, alertType) {
        $scope.alertClass = ["alert"];

        if(alertType == "success") {
            $scope.alertClass.push("alert-success");
        } else if(alertType == "warning") {
            $scope.alertClass.push("alert-danger");
        }

        $scope.defaultAlert = true;
        $scope.alertMsg = alertMsg;
    }

    $scope.getUserList = function () {
        $scope.pgOffset = ($scope.page.currentPage - 1) * $scope.page.pageSize;
        $http({
            method: "POST",
            url: "/api/userList",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "searchText" : $scope.searchText, "offset" : $scope.pgOffset, "pageSize" : $scope.page.pageSize }
        }).then(function success (res) {
            $scope.defaultAlert = false;
            $scope.userList = res.data.userList;
            $scope.page.totalCount = res.data.totalCount;
            $scope.page.pages = Math.ceil($scope.page.totalCount/$scope.page.pageSize);
        }, function error (error) {
            $scope.alertHandling("에러가 발생하였습니다", "danger");
        });
    }

    // init
    $scope.init();

    // pagination
    $scope.pageChanged = function () {
        $scope.getUserList();
    }

    // 검색
    $scope.search = function () {
        $scope.page = angular.copy($scope.initPage);
        $scope.getUserList();
    }

    // enter키
    $scope.enterEvent = function ($event) {
        if ($event.keyCode == 13) {
            $scope.search();
        }
    }

    // modal 생성
    $scope.addUser = function () {
        var addModalIns = $uibModal.open({
            templateUrl: "/user/modalAddUser",
            controller: "addUserModalCtrl"
        });

        addModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.init();
            }
        });
    }

    // modal 비밀번호 초기화
    $scope.pwdReset = function (id) {
        var resetModalIns = $uibModal.open({
            templateUrl: "/user/modalPwdReset",
            controller: "pwdResetModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        resetModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.alertHandling(selectedItem + "계정 비밀번호 초기화되었습니다", "success");
            }
        });
    }

    // modal 삭제
    $scope.delUser = function (id) {
        var delModalIns = $uibModal.open({
            templateUrl: "/user/modalDelUser",
            controller: "delUserModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        delModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.getUserList();
            }
        });
    }

    // modal 수정
    $scope.editUser = function (id) {
        var editModalIns = $uibModal.open({
            templateUrl: "/user/modalEditUser",
            controller: "editUserModalCtrl",
            resolve : {
                id : function () {
                    return id;
                }
            }
        });

        editModalIns.result.then(function (selectedItem) {
            if(selectedItem != false) {
                $scope.init();
            }
        });
    }
});

/**
*  user 생성
*/
routeApp.controller("addUserModalCtrl", function ($scope, $uibModalInstance, $http) {
    // init
    $scope.init = function () {
        $scope.initial = {
            id : "",
            pwd : "",
            pwdConfirm: "",
            telcoGubun : "All",
            level : "A"
        };
        $scope.user = $scope.initial;
        $scope.chkUser = false;
        $scope.chkUserName = "";

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    // user validation
    $scope.userValidator = function () {
        var regexp = /^(?=.*\d)(?=.*[a-zA-Z]).*$/

        if(!$scope.chkUser) {
            $scope.idAlertClass = ["alert", "alert-warning"];
            $scope.idAlert = true;
            $scope.idAlertMsg = "중복확인 해주세요";
            return true;
        } else if ($scope.user.id != $scope.chkUserName) {
            $scope.chkUser = false;
            $scope.idAlertClass = ["alert", "alert-warning"];
            $scope.idAlert = true;
            $scope.idAlertMsg = "중복확인 해주세요";
            return true;
        }

        if(angular.isUndefined($scope.user.pwd) || $scope.user.pwd.trim() == "") {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호 입력해주세요";
            return true;
        } else {
            $scope.pwdAlert = false;
        }
        if($scope.user.pwd.trim().length < 8) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호는 최소 8자만 입력가능합니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }

        if(!regexp.test($scope.user.pwd.trim())) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호 형식이 잘못되었습니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }

        if(angular.isUndefined($scope.user.pwdConfirm) || $scope.user.pwdConfirm.trim() == "") {
            $scope.cPwdAlert = true;
            $scope.cPwdAlertMsg = "비밀번호 확인 입력해주세요";
            return true;
        } else {
            $scope.cPwdAlert = false;
        }
        if ($scope.user.pwd != $scope.user.pwdConfirm) {
            $scope.pwdAlert = true;
            $scope.pwdAlertMsg = "비밀번호와 비밀번호 확인이 다릅니다";
            return true;
        } else {
            $scope.pwdAlert = false;
        }

        return false;
    }

    $scope.addUser = function () {
        if($scope.userValidator()) {
            return;
        }

        $http({
            method: "POST",
            url: "/api/addUser",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : $scope.user.id, "pwd" : $scope.user.pwd, "telco" : $scope.user.telcoGubun,
                "level" : $scope.user.level, "regUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "생성이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "에러가 발생하였습니다";
        });
    }

    $scope.checkUserId = function () {
        if (angular.isUndefined($scope.user.id) || $scope.user.id.trim() == "") {
            $scope.idAlertClass = ["alert", "alert-warning"];
            $scope.idAlert = true;
            $scope.idAlertMsg = "ID 입력해주세요";
            return;
        }

        if($scope.user.id.trim().length < 4) {
            $scope.idAlertClass = ["alert", "alert-warning"];
            $scope.idAlert = true;
            $scope.idAlertMsg = "ID는 최소 4자만 입력가능합니다";
            return;
        }

        $http({
            method: "POST",
            url: "/api/checkUserId",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : $scope.user.id }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.idAlertClass = ["alert", "alert-success"];
                $scope.idAlert = true;
                $scope.idAlertMsg = "ID 사용가능합니다.";
                $scope.chkUser = true;
                $scope.chkUserName = $scope.user.id;
            } else {
                $scope.idAlertClass = ["alert", "alert-warning"];
                $scope.idAlert = true;
                $scope.idAlertMsg = "ID 중복입니다.";
                $scope.chkUser = false;
                $scope.chkUserName = "";
            }
        }, function error (error) {
            $scope.idAlertClass = ["alert", "alert-warning"];
            $scope.idAlert = true;
            $scope.idAlertMsg = "에러가 발생하였습니다";
            $scope.chkUser = false;
            $scope.chkUserName = "";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  비밀번호 초기화
 */
routeApp.controller("pwdResetModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.resetPassword = id+"1234mon";
        $scope.modalUserId = id;
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    $scope.ok = function () {
        $http({
            method: "POST",
            url: "/api/pwdReset",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : id, "pwd" : $scope.resetPassword, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "비밀번호 초기화가 실패하였습니다";
            } else {
                $uibModalInstance.close(id);
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  user 삭제
 */
routeApp.controller("delUserModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.modalUserId = id;
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    $scope.ok = function () {
        $http({
            method: "POST",
            url: "/api/delUser",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : id, "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "삭제가 실패하였습니다";
            } else {
                $uibModalInstance.close(id);
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});

/**
 *  user 수정
 */
routeApp.controller("editUserModalCtrl", function ($scope, $uibModalInstance, $http, id) {
    // init
    $scope.init = function () {
        $scope.chkEdit = false;
        $scope.initial = {
            id : "",
            telcoGubun : "All",
            level : "A"
        };

        $http({
            method: "POST",
            url: "/api/getUser",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : id }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "계정정보 조회가 실패하였습니다.";
            } else {
                $scope.user = angular.copy($scope.initial);
                $scope.user.id = id;
                $scope.user.telcoGubun = res.data.telco_gubun;
                $scope.user.level = res.data.user_level;
                $scope.chkEdit = true;
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "에러가 발생하였습니다";
        });

        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        $scope.userID = userInfo.user_id;
    }
    $scope.init();

    $scope.editUser = function () {
        $http({
            method: "POST",
            url: "/api/editUser",
            headers: {
                "Content-Type": "application/json"
            },
            data: { "uid" : $scope.user.id, "telco" : $scope.user.telcoGubun, "level" : $scope.user.level,
                "updUser" : $scope.userID }
        }).then(function success (res) {
            if(res.data == 0) {
                $scope.alertClass = ["alert", "alert-warning"];
                $scope.defaultAlert = true;
                $scope.alertMsg = "생성이 실패하였습니다";
            } else {
                $uibModalInstance.close();
            }
        }, function error (error) {
            $scope.alertClass = ["alert", "alert-warning"];
            $scope.defaultAlert = true;
            $scope.alertMsg = "에러가 발생하였습니다";
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    }
});
