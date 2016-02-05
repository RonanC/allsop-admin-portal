'use strict';

/**
 * @ngdoc service
 * @name allsop.notifyService
 * @description
 * # notifyService
 * Service in the allsop.
 */
angular.module('allsop')
    .service('notifyService', function ($timeout, $rootScope) {
        var vm = this;

        var local = new PouchDB('notifydetails');
        // var remote = new PouchDB('https://desimeentsteryingespelte:428b3ecba6fcddf3536a9776726431b6a3a89d40@ianmcloughlin.cloudant.com/notifydetails');
        // var remote = new PouchDB('http://localhost:5984/notifydetails');
        var db = local;

        // get key and id from DB
        vm.privateKey = '2e218f3f3198512516f2a127d483ad7937111a3fd04da710';
        vm.appId = '00dc3d1a';
        vm.tokens = ['0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961'];
        vm.init = init;
        vm.getDetails = getDetails;
        
        vm.saveMessageId = saveMessageId;
        vm.messages = [];

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
            
            vm.getDetails();
        }

        function getDetails() {
            console.log("getting notify details");

            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                console.log('DB Change');
                console.log('doc: ' + JSON.stringify(doc));

                vm.tokens = ['0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961'];
                // insert call here
            });

            $timeout(function () { $rootScope.$apply(); });
        }
        
        function saveMessageId(resp){
            vm.messages.push(resp);
        }

        return vm;
    });
