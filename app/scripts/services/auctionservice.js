'use strict';

/**
 * @ngdoc service
 * @name allsop.auctionService
 * @description
 * # auctionService
 * Service in the allsop.
 */
angular.module('allsop')
    .service('auctionService', function ($timeout, $rootScope, $q) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var vm = this;
        var local = new PouchDB('auctions');
        // var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/auctions');
        var remote = new PouchDB('https://thanybrondereencedislons:997420e3f613a83f74a5669052ad212212527e5f@ronanconnolly.cloudant.com/allsop-auctions');
        var opts = { live: true };
        var db = local;

        vm.auctionEntries = [];
        vm.init = init;
        vm.getEntries = getEntries;
        vm.addEntry = addEntry;
        vm.removeEntry = removeEntry;

        vm.init();

        function init() {
            // console.log("init");

            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.getEntries();
            });

            local.sync(remote, {
                live: true
            }).on('change', function (change) {
                // yo, something changed!
            }).on('error', function (err) {
                // yo, we got an error! (maybe the user went offline?)
            });
            
            // db.replicate.from(remote, opts);

        }

        function getEntries() {
            vm.auctionEntries = [];
            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                console.log('DB Change, updating list...');
                // console.log('doc: ' + JSON.stringify(doc.rows));
                // addListEntry(doc.rows);
                
                vm.auctionEntries = [];

                doc.rows.forEach(function (entry) {
                    if (entry.id.charAt(0) !== '_') {
                        // vm.auctionTitles.push(entry.doc.where);

                        entry.doc.when = numToDate(entry.doc._id);
                        vm.auctionEntries.push(entry.doc);
                        
                        // console.log(entry.doc);
                        
                        // vm.auctionObjects.push({
                        //     _id: entry.doc._id,
                        //     _rev: 
                        // });
                    }
                });
                
                // console.log(vm.auctionEntries);
                
                $timeout(function () { $rootScope.$apply(); });

            }).catch(function (err) {
                console.log('err: ' + err);
            });

            $timeout(function () { $rootScope.$apply(); });

            return vm.auctionEntries;
        }

        // private
        // function addListEntry(entries) {
        //     entries.forEach(function (entry) {
        //         if (entry.id.charAt(0) !== '_') {
        //             // vm.auctionTitles.push(entry.doc.where);

        //             entry.doc.when = numToDate(entry.doc._id);
        //             vm.auctionEntries.push(entry.doc);
                        
        //             // vm.auctionObjects.push({
        //             //     _id: entry.doc._id,
        //             //     _rev: 
        //             // });
        //         }
        //     });

        //     // console.log(vm.auctionTitles);
        //     // console.log(vm.auctionEntries);
                
                
        //     // This makes sure that the template is refreshed once the list is updated.
        //     // Sometimes PouchDB changes fall through the cracks otherwise.
        //     // IMPORTANT
        //     $timeout(function () { $rootScope.$apply(); });
        // }
        
        // private
        function numToDate(timestr) {
            var asDate = new Date(parseInt(timestr));
            var parsedDate = asDate.toString().slice(0, 21);

            // console.log('time stamp: ' + timestr);
            // console.log('human readable: ' + parsedDate);

            return parsedDate;
        }
        
        // private
        function dateToNum(isostr) {
            var dateToConvert = isostr + ':00 GMT+0000 (GMT)';
            var newDate = new Date(dateToConvert);
            var dateNum = Number(newDate);
            var dateStr = dateNum.toString();

            // console.log('time stamp: ' + isostr);
            // console.log('human readable: ' + parsedDate);

            return dateStr;
        }

        function addEntry(entry, def) {
            // console.log("add");

            entry.when = entry.date.substring(0, 15) + ' ' + entry.time;
            delete entry.date;
            delete entry.time;

            entry._id = dateToNum(entry.when);

            // db.put(entry);

            console.log('new entry: ' + JSON.stringify(entry));

            db.put(entry).then(function (response) {
                db.replicate.to(remote, opts);
                // waits for the onchange event to update the local list from the remote db
                $timeout(function () {
                    def.resolve();
                    // console.log('update with timeout fired')
                }, 100);

            }).catch(function (err) {
                console.log(err);
            });
            
            
            // vm.auctionEntries.push(entry);
            // console.log("vm.auctionEntries: " + JSON.stringify(vm.auctionEntries));


            return def;
        }



        function removeEntry(entry, def) {
            // console.log("remove");
            db.remove(entry).then(function () {
                // db.replicate.to(remote, opts);
                // waits for the onchange event to update the local list from the remote db
                $timeout(function () {
                    def.resolve();
                    // console.log('update with timeout fired')
                }, 100);
            }).catch(function (err) {
                console.log("err: " + err);
            });
            // vm.auctionEntries.splice(index, 1);
            
            return def;
        }

        return vm;
    });
