'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:NotifyCtrl
 * @description
 * # NotifyCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('NotifyCtrl', function ($http, notifyService, $timeout) {
        // http://docs.ionic.io/docs/push-api-examples
        var vm = this;

        vm.notifySuccess = false;
        vm.sendPush = sendPush;

        vm.messages = notifyService.messages;

        function sendPush(message) {
            // Define relevant info
            var privateKey = notifyService.privateKey;
            var tokens = notifyService.tokens;
            var appId = notifyService.appId;

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
                        "alert": "Hello World!"
                    }
                }
            };

            // Make the API call
            $http(req).success(function (resp) {
                // Handle success
                console.log("Ionic Push: Push success!");
                console.log("req: " + JSON.stringify(req));

                resp.message = req.data.notification.alert;
                resp.tokens = req.data.tokens;
                resp.timeStamp = new Date().toISOString().slice(0, 16);

                notifyService.saveMessageId(resp);

                console.log("resp: " + JSON.stringify(resp));

                vm.notifySuccess = true;

                $timeout(function () {
                    vm.notifySuccess = false;
                }, 2000);
            }).error(function (error) {
                // Handle error 
                console.log("Ionic Push: Push error...");
            });
        }

        function checkStatus() {
            var privateKey = notifyService.privateKey;
            var appId = notifyService.appId;
            var statusId = 'your-message-status-code'

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
                console.log("Ionic Push: Push success!");
            }).error(function (error) {
                // Handle error 
                console.log("Ionic Push: Push error...");
            });
        }

    });
