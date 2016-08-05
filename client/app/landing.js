var Landing = angular.module('Landing', ['ngAnimate', 'ngRoute']);

Landing.factory('Config', function() {
  return {
    testUrl: 'http://localhost:3000/test',
    loginUrl: 'http://localhost:3000/login/google',
    baseUrl: 'http://localhost:3000/',
    landingUrl: 'http://localhost:3000/landing.html'
  };
});

Landing.factory('LoginService', function($http, Config) {
  return {
    connectServer: function() {
      return $http.get(Config.landingUrl);
    },
    logIn: function() {
      return $http.get(Config.loginUrl);
    }
  };
});

Landing.controller('LoginController', function($scope, $http, $location, LoginService) {
  $scope.logIn = function() {
    window.location = LoginService.logIn;
  };

  LoginService.connectServer();
});
