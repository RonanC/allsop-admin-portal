'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('HomeCtrl', function (auth, auctionService, $location) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            auth.logout();
        }
    });
