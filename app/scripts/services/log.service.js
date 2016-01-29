(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name allsop.services.logService
     * @description
     * # logService
     * Factory in the allsop.services.
     */
    angular.module('allsop.services')
        .factory('logService', logService);

    function logService($timeout, $rootScope) {
        var logs = [];

        var addLog = function (message) {
            logs.push({
                logdate: (new Date()).toString().slice(4, 24),
                message: message
            });
            $timeout(function () { $rootScope.$apply(); });
        };

        return {
            all: logs,
            add: addLog
        };
    }
})();