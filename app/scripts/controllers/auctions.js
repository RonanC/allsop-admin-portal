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

    // AuctionsCtrl
    // .$inject = [];

    function AuctionsCtrl($scope, $q, $timeout, $rootScope) {
        // vm for viewmodel
        var vm = this;

        // vm.auctionTitles = [];
        vm.auctionEntries = [];

        // pouch
        var db;
        var remote;

        vm.init = init;
        vm.removeEntry = removeEntry;
        vm.addEntry = addEntry;
        init();
        
        // add entry
        function addEntry(entry) {
            entry.when = entry.date.substring(0, 15) + ' ' + entry.time;
            delete entry.date;
            delete entry.time;

            entry._id = formatISO(entry.when);

            db.put(entry);

            console.log('new entry: ' + JSON.stringify(entry));
        };



        function init() {
            // vm.auctionTitles = [];
            vm.auctionEntries = [];

            // not using a local db as not needed in browser (also the replication caused the changes method to fire way too many times)
            // db = new PouchDB('auctions');
            // db = new PouchDB('http://localhost:5984/auctions');
            db = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/auctions');
            
            vm.regex = '\d{2}:\d{2}';
            pouchInit();
        }

        function formatISO(isostr) {

            var dateToConvert = isostr + ':00 GMT+0000 (GMT)';
            var newDate = new Date(dateToConvert);
            var dateNum = Number(newDate);
            var dateStr = dateNum.toString();

            // console.log('time stamp: ' + isostr);
            // console.log('human readable: ' + parsedDate);

            return dateStr;
        }
        
        // remove entry
        function removeEntry(entry, index) {
            vm.auctionEntries.splice(index, 1);
            db.remove(entry);

            // $timeout(function () { $rootScope.$apply(); });
        };

        
        // cannot 2 way bind to a service
        // need to have pouch here for real time binding
        function pouchInit() {
            // var firstSync = false;
            

            var opts = { live: true };
            // db.sync(db, remote);
            // db.replicate.to(remote, opts); // third arg for function error
            // db.replicate.from(remote, opts);

            // get data
            showEntries();
            vm.showEntries = showEntries;
       
            // updates view when db changes
            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.showEntries();
            });

            // vm.refreshList = refreshList;

            // function refreshList() {
            //     $q.when(showEntries())
            //         .then(function () {
            //             // vm.auctionTitles = [];
            //             vm.auctionEntries = [];
            //             db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
            //                 console.log('DB Change, updating list...');
            //                 // console.log('doc: ' + JSON.stringify(doc.rows));
            //                 addListEntry(doc.rows);
            //             });

            //             $timeout(function () { $rootScope.$apply(); });
            //         });
            // }
            
            vm.showEntries = showEntries;
            
            // show entries
            function showEntries() {
                // vm.auctionTitles = [];
                vm.auctionEntries = [];
                db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                    console.log('DB Change, updating list...');
                    // console.log('doc: ' + JSON.stringify(doc.rows));
                    addListEntry(doc.rows);
                });
                
                $timeout(function () { $rootScope.$apply(); });
                
                return;
            }

            function addListEntry(entries) {
                entries.forEach(function (entry) {
                    if (entry.id.charAt(0) !== '_') {
                        // vm.auctionTitles.push(entry.doc.where);

                        entry.doc.when = formatDate(entry.doc._id);
                        vm.auctionEntries.push(entry.doc);
                        
                        // vm.auctionObjects.push({
                        //     _id: entry.doc._id,
                        //     _rev: 
                        // });
                    }
                });

                // console.log(vm.auctionTitles);
                console.log(vm.auctionEntries);
                
                
                // This just makes sure that the template is refreshed once the list is updated.
                // Sometimes PouchDB changes fall through the cracks otherwise.
                // IMPORTANT
                $timeout(function () { $rootScope.$apply(); });
            }

            function formatDate(timestr) {
                var asDate = new Date(parseInt(timestr));
                var parsedDate = asDate.toString().slice(0, 21);

                // console.log("time stamp: " + timestr);
                // console.log("human readable: " + parsedDate);

                return parsedDate;
            }

            vm.showEntries();

        }
    }
})();