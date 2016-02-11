'use strict';

/**
 * @ngdoc service
 * @name allsop.messageService
 * @description
 * # messageService
 * Service in the allsop.
 */
angular.module('allsop')
    .service('messageService', function ($timeout, $rootScope, $filter) {
        var vm = this;
        // var opts = { live: true };

        var local = new PouchDB('messages');
        var remote = new PouchDB('https://wenswattlesedisternmille:df5aedfb7d8c820b4acba94361b4cf6685a5e006@ronanconnolly.cloudant.com/allsop-messages');
        var db = local;

        vm.messages = [];

        vm.init = init;
        vm.getDetails = getDetails;
        vm.saveMessage = saveMessage;
        vm.getMessages = getMessages;
        // vm.updateMessages = updateMessages;

        vm.init();

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
            
            // db.replicate.to(remoteCouch, opts, syncError);
            // db.replicate.from(remote, opts);
            vm.getDetails();
        }

        function getDetails() {
            // console.log("getting notify details");

            db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                //console.log('DB Change');
                // console.log('doc: ' + JSON.stringify(doc.rows));
                vm.messages = [];

                doc.rows.forEach(function (element) {
                    // console.log("element: " + JSON.stringify(element));
                    vm.messages.push(element.doc);
                }, this);
            }).then(function (res) {
                
            }).catch(function (err) {
                console.log('err: ' + err);
            });

            $timeout(function () { $rootScope.$apply(); });
        }

        function saveMessage(message) {
            // console.log('message: ' + JSON.stringify(message));

            db.put(message).then(function (resp) {
                // db.replicate.to(remote, opts);
            }).catch(function (err) {
                console.log('err: ' + err);
            });
            // db.replicate.to(remote, opts);
        }

        function getMessages() {
            $timeout(function () { $rootScope.$apply(); });
            return vm.messages;
        }

        return vm;

    });
