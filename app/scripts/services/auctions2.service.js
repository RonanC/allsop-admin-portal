(function () {

    'use strict';

    /**
     * @ngdoc service
     * @name allsop.services.auctionService
     * @description
     * # auctionService
     * Factory in the 'allsop.services.
     */
    angular.module('allsop.services')
        .factory('auctionService', auctionService);


    function auctionService($q, $rootScope, $timeout, logService) {

        var db = new PouchDB('auctions');
        var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/auctions');

        db.replicate.from(remote, {
            live: true, retry: true
        }).on('change', function (change) {
            // This is just for debugging.
            logService.add("auctionsService: PouchDB received sync from remote.");
        }).on('error', function (err) {
            // This is just for debugging.
            logService.add("auctionsService: PouchDB had an error receiving sync from remote." + JSON.stringify(err));
        });

        var auctionsList = [];
        refreshList();

        function formatDate(timestr) {
            var asDate = new Date(parseInt(timestr));
            return asDate.toString().slice(0, 21);
        }

        function refreshList() {
            // $q.when wraps db.query in a proper primise.
            // db.query uses promises anyway, but they don't play nicely with angular.
            $q.when(
                // Run the design doc auctions with the bydate view.
                // The design doc is synced down from CouchDB, just like a regular document.
                // Hence we actually have a design doc in the local database that is the same as the CouchDB one.
                // We can make this better by ordering the view by date, with newer dates first, and then limiting
                // the view to return only, say, 30 results.
                db.query("listall/bydate")
                )
                .then(function (result) {
                    //console.log(JSON.stringify(result));
                    // When db.query finishes, the following happens.
                    // This is the quickest way of emptying the list while keeping it in the same memory location.
                    // That's needed for the two-way data binding in the template it ends up in.
                    // It's not pretty or efficient, but it works.
                    auctionsList.length = 0;
                    // Once the list is emptied, we re-populate it.
                    for (var i = 0; i < result.rows.length; i++) {
                        auctionsList[i] = {
                            when: formatDate(result.rows[i].value.when),
                            where: result.rows[i].value.where,
                            info: result.rows[i].value.info
                        };
                    }

                    // This just makes sure that the template is refreshed once the list is updated.
                    // Sometimes PouchDB changes fall through the cracks otherwise.
                    $timeout(function () { $rootScope.$apply(); });
                })
                .catch(function (err) {
                    // Just for debugging.
                    logService.add("auctionsService: " + "error refreshing auctions list - " + JSON.stringify(err));
                });

        }

        db.changes({
            // Start looking for changes from now.
            since: 'now',
            // Keep looking for changes, don't just look once and finish.
            live: true
        }).on('change', function (change) {
            // When a change happens, call the refreshList function.
            refreshList();
        }).on('error', function (err) {
            // Just for debugging.
            logService.add("auctionsService: error in changes.");
        });


        // returning list
        return {
            list: auctionsList
        };
    }
})();
