'use strict';

describe('Controller: NotifyCtrl', function () {

  // load the controller's module
  beforeEach(module('allsop'));

  var NotifyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotifyCtrl = $controller('NotifyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NotifyCtrl.awesomeThings.length).toBe(3);
  });
});
