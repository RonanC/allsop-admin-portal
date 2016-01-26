/* global inject */
'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('mytodoApp'));

    var MainCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        // MainCtrl.todos = [];
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
            // place here mocked dependencies
        });
    }));

    it('should have no items to start', function () {
        expect(MainCtrl.todos.length).toBe(0);
    });

    it('should add items to the list', function () {
        MainCtrl.todo = 'Test 1';
        MainCtrl.addTodo();
        expect(MainCtrl.todos.length).toBe(1);

    });

    it('should add then remove item from the list', function () {
        MainCtrl.todo = 'Test 1';
        MainCtrl.addTodo();
        MainCtrl.removeTodo(0);
        expect(MainCtrl.todos.length).toBe(0);

    });
});
