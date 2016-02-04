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

        // public functions
        vm.auctionEntries = [];
        // vm.init = init;
        vm.refreshList = refreshList;
        vm.removeEntry = removeEntry;
        vm.addEntry = addEntry;
        vm.regex = '\\d{2}:\\d{2}';

        // call functions
        auctionService.getEntries()
        vm.refreshList();
        
        // this gets called every 5 seconds
        // this is not efficient, it is only needed the first time you visit the page
        // var checkList;
        // checkList = $interval(function(){
        //     vm.refreshList();
        // }, 5000);
        
        function refreshList() {
            // auctionService.getEntries();
            vm.auctionEntries = auctionService.auctionEntries;
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