(function () {
    'use strict';

    // pouchservice factory
    angular
        .module('allsop')
        .factory('pouchservice', pouchservice);

    pouchservice.$inject = ['$http', 'logger'];

    function pouchservice($http, logger) {
        return {
            getTodos: getTodos
        };

        function getTodos() {
            var vm = this;
            
            // initial setup of pouch
            function initPouch() {
                vm.local = new PouchDB('todos');
                // vm.remote = new PouchDB('http://localhost:5984/todos');
                vm.db = vm.local;
            }
        
            // add a todo to pouch
            function addTodoPouch(text) {
                var newTodo = {
                    _id: new Date().toISOString(),
                    title: text,
                    completed: false
                };

                vm.db.put(newTodo, function callback(err, result) {
                    if (!err) {
                        console.log('successfully posted a todo!');
                        console.log(newTodo);
                    }
                });
            }
        
            // refreshes todo list
            function refreshTodos() {
                vm.todos = [];
                vm.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                    // doc.rows.forEach(function(element) {
                    //     vm.todos.push(element.title);
                    // }, this);
                    vm.todos = doc.rows;
                    console.log(JSON.stringify(vm.todos[2]))
                    console.log(JSON.stringify(vm.todos[2].doc.title))
                    // console.log(vm.todos[0].doc.title)
                });
            }
        
        
            // remove a todo from pouch
            function removeTodoPouch(todo) {
                vm.db.remove(todo);
            }
            
            
            // return $http.get('/api/maa')
            //     .then(getAvengersComplete)
            //     .catch(getAvengersFailed);

            // function getAvengersComplete(response) {
            //     return response.data.results;
            // }

            // function getAvengersFailed(error) {
            //     logger.error('XHR Failed for getAvengers.' + error.data);
            // }
        }
    }
});