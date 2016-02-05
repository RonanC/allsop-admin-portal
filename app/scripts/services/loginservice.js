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
        // var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/logindetails');
        // var remote = new PouchDB('http://localhost:5984/logindetails');
        var db = local;

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
                vm.getDetails();
            });

            // local.sync(remote, {
            //     live: true
            // }).on('change', function (change) {
            //     // yo, something changed!
            // }).on('error', function (err) {
            //     // yo, we got an error! (maybe the user went offline?)
            // });

            vm.getUser();
        }

        function getUser() {
            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                console.log('DB Change');
                // console.log('doc: ' + JSON.stringify(doc.total_rows));

                if (doc.total_rows < 1) {
                    vm.user.username = "root"
                    vm.user.password = "toor"
                    vm.saveUser();
                } else {
                    vm.user.username = doc.rows[0].doc.username;
                    vm.user.password = doc.rows[0].doc.password;
                }

            });

            $timeout(function () { $rootScope.$apply(); });
        }

        function saveUser() {
            // console.log("saving user: " + JSON.stringify(vm.user));
            db.put(vm.user);
        }

        return vm;
    });
