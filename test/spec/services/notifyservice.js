'use strict';

describe('Service: notifyService', function () {

  // load the service's module
  beforeEach(module('allsop'));

  // instantiate service
  var notifyService;
  beforeEach(inject(function (_notifyService_) {
    notifyService = _notifyService_;
  }));

  it('should do something', function () {
    expect(!!notifyService).toBe(true);
  });

});
