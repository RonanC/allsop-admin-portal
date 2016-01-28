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
        'LocalStorageModule'
    ])
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        // use custom local storage name
        localStorageServiceProvider.setPrefix('ls');
    }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
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
            .otherwise({
                redirectTo: '/'
            });
    });
