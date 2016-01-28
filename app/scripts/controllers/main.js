'use strict';

/**
 * @ngdoc function
 * @name allsop.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the allsop
 */
angular.module('allsop')
    .controller('MainCtrl', function ($scope, localStorageService) {
        // vm for viewmodel
        var vm = this;
        
        // get todos from local storage
        // list of todos
        // vm.todos = [];
        var todosInStore = localStorageService.get('todos');
        // get todos from local storage, if that fails (not there) then create new empty array
        vm.todos = todosInStore || [];
        
        // watch for updates
        // $scope.todos = vm.todos;
        $scope.$watch(
            'main.todos',   // main is taken from the 'controller as' in the html
            function () {
                localStorageService.set('todos', vm.todos);
            }, true); 
        
        // add todo
        vm.addTodo = function () {
            if (vm.todos.indexOf(vm.todo) === -1) {
                vm.todos.push(vm.todo);
                vm.todo = '';
                
                // localStorageService.set('todos', vm.todos);
            }
        };
        
        // remove todo
        vm.removeTodo = function (index) {
            vm.todos.splice(index, 1);
            
            // localStorageService.set('todos', vm.todos);
        };
    });