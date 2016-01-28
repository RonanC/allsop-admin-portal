'use strict';

describe('Controller: AuctionsCtrl', function () {

  // load the controller's module
  beforeEach(module('allsop'));

  var AuctionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AuctionsCtrl = $controller('AuctionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AuctionsCtrl.awesomeThings.length).toBe(3);
  });
});
