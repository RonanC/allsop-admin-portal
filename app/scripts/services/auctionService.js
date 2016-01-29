(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name allsop
     * @description
     * # auctionService
     * Factory in the allsop.
     */
    angular.module('allsop')
        .service('auctionService', auctionService);
    // we use a service because we want to use (this), we will not return anything

    auctionService
    .$inject = ['$q', '$rootScope', '$timeout'];

    function auctionService($q, $rootScope, $timeout) {
        var firstSync = false;
        auctionService.auctionTitles = [];
        var auctionEntries = [];

        var db = new PouchDB('todos');
        var remote = new PouchDB('http://localhost:5984/todos');
        // var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/auctions');

        var opts = { live: true };
        db.replicate.to(remote, opts); // third arg for function error
        db.replicate.from(remote, opts);

        // get data
        showEntries();
       
        // updates view when db changes
        db.changes({
            since: 'now',
            live: true
        }).on('change', showEntries);
        
        // Initialise a sync with the remote server
        // function sync() {
        //     if (syncDom) {
        //         syncDom.setAttribute('data-sync-state', 'syncing');
        //     }

        //     var opts = { live: true };
        //     db.replicate.to(remote, opts); // third arg for function error
        //     db.replicate.from(remote, opts);
        // }
        
        // auctionService.getTitles = getTitles;

        function getTitles() {
            return auctionService.auctionTitles;
        }
        
        // show entries
        function showEntries() {
            auctionService.auctionTitles = []
            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                // console.log("doc.rows: " + JSON.stringify(doc.rows));
                console.log("DB Change, updating list...");
                addTitles(doc.rows);
            });
        }

        function addTitles(entries) {
            entries.forEach(function (entry) {

                if (entry.id.charAt(0) != '_') {
                    // console.log(entry.id.charAt(0) + " is not _");
                    console.log(JSON.stringify(entry.id));
                    // auctionTitles.push(entry.doc.title);
                    auctionService.auctionTitles.push(entry.doc.where);
                    auctionEntries.push(entry);
                    // console.log("auctionTitles: " + auctionTitles);
                }

            });
        }

        // function isNumber(obj) { return !isNaN(parseFloat(obj)) }
        
        // add entry
        
        // remove entry
        
        
        // edit entry
        
        // global data?
        // this.get = function () {
        //     // do your ajax call to get your user data and in the response data = response;
        // }

        // this.auctionTitles = function () {
        //     return auctionTitles;
        // }

        // this.auctionTitles = {
        //     get value() {
        //         return this.auctionTitles;
        //     },
        //     set value(update) {
        //         this.auctionTitles = update;
        //     }
        // };
        

        // Public API here
        return {
            //   getAuctions: function () {
            //     return auctions;
            //   }
            
            // titles: auctionTitles,
            
            // entries: auctionEntries,
            // getTitles: function () {
            //     if (firstSync) {
            //         return auctionTitles;
            //     } else {
            //         return auctionTitles;
            //     }
            //     // $timeout(function () { $rootScope.$apply(); });
            //     console.log("result: " + result);
            //     console.log("auctionTitles: " + auctionTitles);

            // }
            
            getTitles: function () {
                return auctionService.auctionTitles;
            }
        }
    };


})();