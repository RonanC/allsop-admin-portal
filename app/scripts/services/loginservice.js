'use strict';

/**
 * @ngdoc service
 * @name allsop.loginService
 * @description
 * # loginService
 * Service in the allsop.
 */
angular.module('allsop')
    .service('loginService', function ($timeout, $rootScope) {
        var vm = this;
        var local = new PouchDB('loginDetails');
        // var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/loginDetails');
        var db = local;

        vm.user = { username: 'root', password: 'toor' };
        vm.init = init;
        vm.getDetails = getDetails;
        vm.addDetails = addDetails;
        vm.removeDetails = removeDetails;

        vm.init();

        function init() {
            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.getDetails();
            });

            // local.sync(remote, {
            //     live: true
            // }).on('change', function (change) {
            //     // yo, something changed!
            // }).on('error', function (err) {
            //     // yo, we got an error! (maybe the user went offline?)
            // });
        }

        function getDetails() {
            vm.users = [];
            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                console.log('DB Change, updating list...');
                console.log('doc: ' + JSON.stringify(doc.rows));
                // addListEntry(doc.rows);
                // vm.user = doc.rows;
                
            });

            $timeout(function () { $rootScope.$apply(); });

            // return vm.users;
        }

        // private
        // function addListEntry(entries) {
        //     entries.forEach(function (entry) {
        //         if (entry.id.charAt(0) !== '_') {
        //             // vm.auctionTitles.push(entry.doc.where);

        //             entry.doc.when = formatDate(entry.doc._id);
        //             vm.users.push(entry.doc);
        //         }
        //     });

            // console.log(vm.auctionTitles);
            // console.log(vm.users);
                
                
            // This makes sure that the template is refreshed once the list is updated.
            // Sometimes PouchDB changes fall through the cracks otherwise.
            // IMPORTANT
        //     $timeout(function () { $rootScope.$apply(); });
        // }
        

        function addDetails(entry, def) {
            // console.log("add");

            entry.when = entry.date.substring(0, 15) + ' ' + entry.time;
            delete entry.date;
            delete entry.time;

            // entry._id = formatISO(entry.when);

            // db.put(entry);


            db.put(entry).then(function (response) {
                // waits for the onchange event to update the local list from the remote db
                $timeout(function () {
                    def.resolve();
                    // console.log('update with timeout fired')
                }, 100);

            }).catch(function (err) {
                console.log(err);
            });
            
            
            // vm.users.push(entry);
            // console.log("vm.users: " + JSON.stringify(vm.users));
            // console.log('new entry: ' + JSON.stringify(entry));

            return def;
        }

        function removeDetails(entry, def) {
            // console.log("remove");
            db.remove(entry).then(function () {
                // waits for the onchange event to update the local list from the remote db
                $timeout(function () {
                    def.resolve();
                    // console.log('update with timeout fired')
                }, 100);
            });
            // vm.users.splice(index, 1);
            
            return def;
        }

        return vm;
    });
