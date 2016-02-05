'use strict';

/**
 * @ngdoc service
 * @name allsop.auth
 * @description
 * # auth
 * Service in the allsop.
 */
angular.module('allsop')
    .service('auth', function ($location) {
        var user = false;

        return {
            setUser: function (aUser) {
                user = aUser;
            },
            isLoggedIn: function () {
                return (user) ? user : false;
            },
            logout: function () {
                user = false;
                console.log("logging out");
                $location.path('/login');
            }
        }

    });
