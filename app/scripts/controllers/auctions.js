/* global PouchDB */
(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name allsop.controller:AuctionsCtrl
     * @description
     * # AuctionsCtrl
     * Controller of the allsop
     */
    angular.module('allsop')
        .controller('AuctionsCtrl', AuctionsCtrl);

    function AuctionsCtrl($q, $scope, auctionService) {
        // vm for viewmodel
        var vm = this;

        vm.auctionEntries = [];
        vm.init = init;
        vm.refreshList = refreshList;
        vm.removeEntry = removeEntry;
        vm.addEntry = addEntry;
        // vm.editEntry = editEntry;
        
        init();

        function refreshList() {
            // auctionService.getEntries();
            vm.auctionEntries = auctionService.auctionEntries;
        }

        function init() {
            auctionService.init();
            vm.regex = '\\d{2}:\\d{2}';
            // vm.regex = '\d{2}:\d{2}';
            auctionService.getEntries()
            vm.refreshList();
        }

        function addEntry(entry) {
            var def = $q.defer();
            auctionService.addEntry(entry, def);
            
            // waits for entry to be added to the remote db
            def.promise.then(function () {
                // console.log("ready");
                vm.refreshList();
            });
        };

        function removeEntry(entry) {
            var def = $q.defer();
            auctionService.removeEntry(entry, def);
            
            // waits for entry to be added to the remote db
            def.promise.then(function () {
                // console.log("ready");
                vm.refreshList();
            });
        };
    }
})();