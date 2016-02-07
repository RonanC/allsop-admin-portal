'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:NotifyCtrl
 * @description
 * # NotifyCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('NotifyCtrl', function ($http, notifyService, $timeout, $interval) {
        // http://docs.ionic.io/docs/push-api-examples
        var vm = this;

        vm.notifySuccess = false;
        vm.notifyError = false;
        vm.notifyWarning = false;

        vm.sendPush = sendPush;

        vm.messages = notifyService.getMessages();

        $timeout(function () {
            vm.messages = notifyService.getMessages();
        }, 250);

        $timeout(function () {
            vm.messages = notifyService.getMessages();
        }, 500);

        $timeout(function () {
            vm.messages = notifyService.getMessages();
        }, 1000);

        $timeout(function () {
            refreshMsgStatus();
        }, 1000);
        
        // this gets called every 5 seconds
        // this is not efficient, it is only needed the first time you visit the page
        var refreshInterval;
        refreshInterval = $interval(function () {
            // console.log("interval...");
            refreshMsgStatus();
        }, 10000);

        // add user simulation
        // test user
        var userRonan = {};
        userRonan.deviceToken = '0d3b6bb237825183573af83a8d05380775625b154e93a3c4e2082058d5e06961';
        userRonan.deviceType = 'ios';
        userRonan.timeStamp = new Date().toISOString().slice(0, 16);

        $timeout(function () {
            console.log('adding user...');
            notifyService.saveUser(userRonan);
        }, 5000);

        function refreshMsgStatus() {
            // var def = $q.defer();
            var index = 0;
            // var length = vm.messages.length;

            vm.messages.forEach(function (message) {

                if (message.result == 'queued') {
                    // console.log("message: " + JSON.stringify(message));
                    checkStatus(message, index);
                }

                // if (index >= length - 1) {
                //     console.log('count: ' + index + '\nlength-1: ' + (length - 1));
                //     def.resolve();
                // }

                index++;
            }, this);

            // def.promise.then(function () {
            //     // console.log("ready");
            //     notifyService.updateMessages(vm.messages);
            // });

            $timeout(function () {
                notifyService.updateMessages(vm.messages);
            }, 5000);

        }


        // vm.debugLog = notifyService.debugLog;

        function sendPush(message) {
            vm.notifyWarning = true;
            
            // Define relevant info
            var privateKey = notifyService.appDetails.privateKey;
            var tokens = notifyService.deviceTokens;
            var appId = notifyService.appDetails.appId;

            // Encode your key
            var auth = btoa(privateKey + ':');

            // Build the request object
            var req = {
                method: 'POST',
                url: 'https://push.ionic.io/api/v1/push',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ionic-Application-Id': appId,
                    'Authorization': 'basic ' + auth
                },
                data: {
                    "tokens": tokens,
                    "notification": {
                        "alert": message.message
                    }
                }
            };

            console.log("req: " + JSON.stringify(req));

            // Make the API call
            $http(req).success(function (resp) {
                // Handle success
                //console.log("Ionic Push: Push success!");


                resp.message = req.data.notification.alert;
                resp.tokens = req.data.tokens;
                resp.timeStamp = new Date().toISOString().slice(0, 16);

                notifyService.saveMessageId(resp);
                vm.messages = notifyService.getMessages();
                //console.log("resp: " + JSON.stringify(resp));

                vm.notifyWarning = false;
                vm.notifySuccess = true;
                $timeout(function () {
                    vm.notifySuccess = false;
                }, 4000);
            }).error(function (error) {
                // Handle error 
                console.log("Ionic Push: Push error...");

                vm.notifyWarning = false;
                vm.notifyError = true;
                $timeout(function () {
                    vm.notifyError = false;
                }, 4000);
            });
        }

        function checkStatus(message, index) {
            var privateKey = notifyService.appDetails.privateKey;
            var appId = notifyService.appDetails.appId;
            var statusId = message.message_id; //'your-message-status-code'

            // Encode your key
            var auth = btoa(privateKey + ':');

            // Build the request object
            var req = {
                method: 'GET',
                url: 'https://push.ionic.io/api/v1/status/' + statusId,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ionic-Application-Id': appId,
                    'Authorization': 'basic ' + auth
                }
            };

            // Make the API call
            $http(req).success(function (resp) {
                // Handle success
                // console.log("Ionic Push: Push success!");
                // console.log("req: " + JSON.stringify(req));
                // console.log("resp: " + JSON.stringify(resp.status));
                // newStatus = resp.status;÷
                // return resp.status;
                vm.messages[index].result = resp.status;
                console.log(vm.messages[index]);
            }).error(function (error) {
                // Handle error 
                console.log("Ionic Push: Push error...");
                console.log("error: " + JSON.stringify(error));
                // return 'Unknown';
            });

        }

    });
