'use strict';

/**
 * @ngdoc service
 * @name allsopAdminApp.pouchService
 * @description
 * # pouchService
 * Factory in the allsopAdminApp.
 */
angular.module('allsopAdminApp')
  .factory('pouchService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
