angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

  var vm = this;

  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();

  // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();

    // get user information on route change
    Auth.getUser()
    .then(function(data) {
     vm.user = data;
   });
  });

  // function to handle login form
  vm.doLogin = function() {
    // call the Auth.login() function
    console.log('emaillog: ' + vm.loginData.emaillog);
    console.log('passwordlog: ' + vm.loginData.passwordlog);
    Auth.login(vm.loginData.emaillog, vm.loginData.passwordlog)
    .then(function(data) {
      // if a user successfully logs in, redirect to users page
      if (data.then)     
        $location.path('/newentry');
      else 
        vm.error = data.message;

    });
  };

  // function to handle logging out
  vm.doLogout = function() {
    Auth.logout();
    // reset all user info
    vm.user = {};
    $location.path('/');
  };

});