/**
 * Created by ??? on 2017-12-22.
 */
var routeApp = app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state("pwdChange", {
            url: "/pwdChange",
            templateUrl: "/user/pwdChange",
            controller: "pwdChangeCtrl"
        })
        .state("userAdmin", {
            url: "/userAdmin",
            templateUrl: "/user/admin",
            controller: "userAdminCtrl"
        })
        .state("streaming", {
            url: "/",
            templateUrl: "/streaming/dashboard"
        })
        .state("alertConfig", {
            url: "/alertConfig",
            templateUrl: "/alert/config",
            controller: "alertConfigCtrl"
        });
});