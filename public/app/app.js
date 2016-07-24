var userApp = angular.module('userApp', [
  'app.routes', //routing
  'authService', //auth
  'mainCtrl',
  'userService' //create, get, update
]);