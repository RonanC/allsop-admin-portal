'use strict';

/**
 * @ngdoc overview
 * @name allsop
 * @description
 * # allsop
 *
 * Main module of the application.
 */
angular
    .module('allsop', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.sortable',
        'LocalStorageModule',
        '720kb.datepicker'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            // .when('/', {
            //     templateUrl: 'views/main.html',
            //     controller: 'MainCtrl',
            //     controllerAs: 'main'
            // })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            })
            .when('/auctions', {
                templateUrl: 'views/auctions.html',
                controller: 'AuctionsCtrl',
                controllerAs: 'auctions'
            })
            .when('/notify', {
                templateUrl: 'views/notify.html',
                controller: 'NotifyCtrl',
                controllerAs: 'notify'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .otherwise({
                redirectTo: '/home'
            });
    })
    .run(['$rootScope', '$location', 'auth', function ($rootScope, $location, auth) {
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!auth.isLoggedIn()) {
                console.log('DENY');
                // event.preventDefault();
                $location.path('/login');
            }
            else {
                console.log('ALLOW');
                $location.path($location.$$path);
            }
        });
    }]);