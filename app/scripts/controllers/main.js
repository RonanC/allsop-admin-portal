'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('MainCtrl', function ($scope, auctionService, auth, $location) {
        $scope.$watch(auth.isLoggedIn, function (value, oldValue) {

            if (!value && oldValue) {
                console.log("Disconnect");
                $location.path('/login');
            }

            if (value) {
                console.log("Connect");
                //Do something when the user is connected
            }

        }, true);
    });
    
   