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

        var local = new PouchDB('logindetails');
        var remote = new PouchDB('https://malledingetteralleadstak:2647335840445ee4357ab6bbb0fdb31aa9ae9961@ronanconnolly.cloudant.com/allsop-backend');
        var db = local;

        // defaults
        // vm.user = { username: 'allsop', password: 'poslla' };
        
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
                    if (element.id === 'loginDetails') {
                        // console.log("element: " + JSON.stringify(element));

                        if (doc.total_rows < 1) {
                            vm.user.username = "allsop"
                            vm.user.password = "poslla"
                            // vm.saveUser();
                        } else {
                            vm.user.username = element.doc.username;//doc.rows[0].doc.username;
                            vm.user.password = element.doc.password;//doc.rows[0].doc.password;
                            // console.log("vm.user: " + JSON.stringify(vm.user));
                        }
                    }
                }, this);

            });

            $timeout(function () { $rootScope.$apply(); });
        }

        function saveUser() {
            // console.log("saving user: " + JSON.stringify(vm.user));
            // db.put(vm.user);
        }

        return vm;
    });
