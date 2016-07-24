angular.module('authService', [])

// auth factory to login and get information
// $http to communicate with API
// $q to return promise objects
// AuthToken to manage tokens
// ===================================================

.factory('Auth', function($http, $q, AuthToken) {

  // create auth factory object
  var authFactory = {};

  // log user in
  authFactory.login = function(emaillog, passwordlog) {
  // return the promise object and its data
    console.log('email to login: ' + emaillog);
    console.log('password to login: ' + passwordlog);
    return $http.post('/api/', {
      withCredentials: true,
      email: emaillog,
      password: passwordlog
    })
    .then(function(data) {
      AuthToken.setToken(data.token);
      return data;
    });
  };

  // log a user out by clearing the token
  authFactory.logout = function() {
  // clear the token
    AuthToken.setToken();
  };

  // check if a user is logged in
  // checks if there is a local token
  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken())
      return true;
    else
      return false;
  };


  // get the user info to be able to update password?
  // get the logged in user
  authFactory.getUser = function() {
   if (AuthToken.getToken())
    return $http.get('/api/me', { cache: true });
  else
    return $q.reject({ message: 'User has no token.' });
  };



  // return auth factory object
  return authFactory;

})

// factory for handling tokens
// $window to store token client-side
.factory('AuthToken', function($window) {

  var authTokenFactory = {};

  // get the token
  // get the token out of local storage
  authTokenFactory.getToken = function() {
   return $window.localStorage.getItem('token');
  };

 // if a token is passed, set the token
 // if there is no token, clear it from local storage
 authTokenFactory.setToken = function(token) {
  if (token) {
    $window.localStorage.setItem('token', token);
  } else {
    $window.localStorage.removeItem('token');
  }
};

return authTokenFactory;

})

 
// configuration to integrate token into requests
.factory('AuthInterceptor', function($q, AuthToken) {
  var interceptorFactory = {};
  // all HTTP requests
  interceptorFactory.request = function(config) {
    // get the token
    var token = AuthToken.getToken();
    // if the token exists, add it to the header as x-access-token
    if (token){
      config.headers['x-access-token'] = token;
    }
    return config;
  };

  // on response error
  interceptorFactory.responseError = function(response) {
    // if our server returns a 403 forbidden response
    if (response.status == 403) {
     AuthToken.setToken();
     $location.path('/');
    }

    // return errors from server as a promise
    return $q.reject(response);
  };

  return interceptorFactory;

});