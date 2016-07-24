angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

  $routeProvider

  // home page route
  .when('/', {
    templateUrl : 'app/views/pages/loginregister.html',
    controller : 'mainController',
    controllerAs: 'login'
  })

  // accounts page
  .when('/api/accounts', {
    templateUrl : 'app/views/pages/accounts.html'
  });

   // get rid of the hash in the URL
   $locationProvider.html5Mode(true);

});