'use strict';

describe('Service: pouchService', function () {

  // load the service's module
  beforeEach(module('allsopAdminApp'));

  // instantiate service
  var pouchService;
  beforeEach(inject(function (_pouchService_) {
    pouchService = _pouchService_;
  }));

  it('should do something', function () {
    expect(!!pouchService).toBe(true);
  });

});
