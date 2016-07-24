angular.module('userService', [])

.factory('User', function($http) {

  // create a new object
  var userFactory = {};

  // get a single user
  userFactory.get = function(id) {
    return $http.get('/api/me');
  };

  // create a user
  userFactory.create = function(userData) {
    return $http.post('/api/', userData);
  };

   // update a user
   userFactory.update = function(id, userData) {
    return $http.put('/api/user/' + id, userData);
  };

  //  // delete a user - make a deletion mark only?
  //  userFactory.delete = function(id) {
  //   return $http.delete();
  // };

  // return entire userFactory object
  return userFactory;

});