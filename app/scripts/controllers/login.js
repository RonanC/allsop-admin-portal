'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('LoginCtrl', function ($rootScope, auth, loginService, $location) {
        var vm = this;
        vm.loginAttempt = login;
        vm.user = loginService.user;
        $rootScope.isLoggedOut = true;

        if (auth.isLoggedIn()) {
            $location.path('/home');
        }

        function login(user) {
            if (vm.user.username == user.username && vm.user.password == user.password) {
                $rootScope.isLoggedOut = false;
                auth.setUser(true);
                console.log("Login Successful!");
                $location.path('/home');
            } else {
                console.log("Login Failed!");
            }

            console.log("vm.user: " + JSON.stringify(vm.user));
            console.log("user: " + JSON.stringify(user));
        }
    });
