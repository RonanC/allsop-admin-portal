'use strict';

/**
 * @ngdoc service
 * @name allsop.detailsService
 * @description
 * # detailsService
 * Service in the allsop.
 */
angular.module('allsop')
    .service('detailsService', function ($timeout, $rootScope) {
        var vm = this;

        var local = new PouchDB('details');
        var remote = new PouchDB('https://shermentmentsaliencenear:ff24d6530cbe397679b76e6c3a94844a33688cf6@ronanconnolly.cloudant.com/allsop-details');
        var db = local;

        // defaults
        // vm.user = { username: 'allsop', password: 'poslla' };
        
        vm.appDetails = {};

        vm.user = {};
        vm.init = init;
        vm.getUser = getUser;
        vm.saveUser = saveUser;

        vm.init();

        function init() {
            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.getUser();
            });

            // local.sync(remote, {
            //     live: true
            // }).on('change', function (change) {
            //     // yo, something changed!
            // }).on('error', function (err) {
            //     // yo, we got an error! (maybe the user went offline?)
            // });
            
            local.replicate.from(remote);

            vm.getUser();
        }

        function getUser() {
            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                //console.log('DB Change');
                // console.log('doc: ' + JSON.stringify(doc));

                doc.rows.forEach(function (element) {
                    if (element.id === 'appDetails') {
                        // console.log("element: " + JSON.stringify(element.id));
                        vm.appDetails = element.doc;
                        // console.log("vm.appDetails: " + JSON.stringify(vm.appDetails));
                    } else if (element.id === 'loginDetails') {
                        // console.log("element: " + JSON.stringify(element));

                        if (doc.total_rows < 1) {
                            vm.user.username = 'allsop';
                            vm.user.password = 'poslla';
                            // vm.saveUser();
                        } else {
                            vm.user.username = element.doc.username;//doc.rows[0].doc.username;
                            vm.user.password = element.doc.password;//doc.rows[0].doc.password;
                            // console.log('vm.user: ' + JSON.stringify(vm.user));
                        }
                    }
                }, this);
            }).catch(function (err) {
                console.log('err: ' + err);
            });

            $timeout(function () { $rootScope.$apply(); });
        }

        function saveUser() {
            // console.log("saving user: " + JSON.stringify(vm.user));
            // db.put(vm.user);
        }

        return vm;
    });
