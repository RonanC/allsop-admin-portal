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

        var local = new PouchDB('allsop-app');
        var remote = new PouchDB('https://fforecrocheseentelticken:bebcc9f90aab1ed06adbdf8ee0f8d23bce5c8300@ronanconnolly.cloudant.com/allsop-app');
        var db = local;

        // appDetails
        vm.appDetails = {};
        // vm.appDetails.privateKey = '2e218f3f3198512516f2a127d483ad7937111a3fd04da710';
        // vm.appDetails.appId = '00dc3d1a';
        
        // users
        vm.users = [];
        vm.deviceTokens = [];
        
        // test user
        var userRonan = {};
        userRonan.deviceToken = '0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961';
        userRonan.deviceType = 'ios';
        userRonan.timeStamp = new Date().toISOString().slice(0, 16);
        
        // add user to list
        // vm.users.users.push(userRonan);
        
        // messages
        vm.messages = [];

        vm.init = init;
        vm.getDetails = getDetails;
        vm.saveMessageId = saveMessageId;

        vm.init();

        // vm.debugLog = debugLog;
        // function debugLog() {
        //     console.log("test");
        //     console.log('vm.users: ' + JSON.stringify(vm.users));
        // }

        // function saveMessagesToDb(){
            
        // }

        function init() {
            db.changes({
                since: 'now',
                live: true
            }).on('change', function () {
                vm.getDetails();
                // db.replicate.to(remote);
            });

            local.sync(remote, {
                live: true
            }).on('change', function (change) {
                // yo, something changed!
            }).on('error', function (err) {
                // yo, we got an error! (maybe the user went offline?)
            });
            
            // var opts = { live: true };
            // db.replicate.to(remoteCouch, opts, syncError);
            // db.replicate.from(remote, opts);



            vm.getDetails();
        }

        function getDetails() {
            // console.log("getting notify details");

            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                //console.log('DB Change');
                // console.log('doc: ' + JSON.stringify(doc.rows));

                doc.rows.forEach(function (element) {
                    // console.log("element: " + JSON.stringify(element.id));
                    if (element.id === 'appDetails') {
                        // console.log("element: " + JSON.stringify(element.id));
                        vm.appDetails = element.doc;
                        // console.log("vm.appDetails: " + JSON.stringify(vm.appDetails));
                    }
                    else if (element.id === 'users') {
                        console.log("length: " + element.doc.users.length);
                        vm.users = element.doc;
                        vm.users.users.push(userRonan);
                        console.log("vm.users: " + JSON.stringify(vm.users));
                        console.log("length: " + element.doc.users.length);

                    } else if (element.id === 'messages') {
                        // console.log("element: " + JSON.stringify(element.id));
                        vm.messages = element.doc;
                        console.log("vm.messages: " + JSON.stringify(vm.messages.messages));
                    }
                }, this);
                
                // vm.appDetails = doc.rows.appDetails;
                // vm.users = [];
                // vm.messages = [];
                
                // vm.tokens = ['0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961'];
                // insert call here
            });

            $timeout(function () { $rootScope.$apply(); });

            console.log("vm.users: " + JSON.stringify(vm.users));
            //getDeviceTokens(vm.users.users);
        }

        function saveMessageId(resp) {
            console.log('vm.messages: ' + JSON.stringify(vm.messages.messages));
            vm.messages.messages.push(resp);
        }

        function getDeviceTokens(users) {
            // if (users.){
            users.forEach(function (user) {
                vm.deviceTokens.push(user.deviceToken);
            }, this);
            // }
        }

        return vm;
    });
