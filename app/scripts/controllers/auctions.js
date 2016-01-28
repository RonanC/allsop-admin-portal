'use strict';

/**
 * @ngdoc function
 * @name allsopAdminApp.controller:AuctionsCtrl
 * @description
 * # AuctionsCtrl
 * Controller of the allsopAdminApp
 */
angular.module('allsopAdminApp')
    .controller('AuctionsCtrl', function ($scope, pouchService, localStorageService) {
        // vm for viewmodel
        var vm = this;
        
        // get entries from local storage
        // list of entries
        // vm.entries = [];
        var entriesInStore = localStorageService.get('entries');
        // get entries from local storage, if that fails (not there) then create new empty array
        vm.entries = entriesInStore || [];
        
        // watch for updates
        // $scope.entries = vm.entries;
        $scope.$watch(
            'auctions.entries',   // main is taken from the 'controller as' in the html
            function () {
                localStorageService.set('entries', vm.entries);
            }, true); 
        
        // add entry
        vm.addEntry = function () {
            if (vm.entries.indexOf(vm.entry) === -1) {
                vm.entries.push(vm.entry);
                vm.entry = '';
                
                // localStorageService.set('entries', vm.entries);
            }
        };
        
        // remove entry
        vm.removeEntry = function (index) {
            vm.entries.splice(index, 1);
            
            // localStorageService.set('entries', vm.entries);
        };
    });
