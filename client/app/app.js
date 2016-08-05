var HaxList = angular.module('HaxList', ['ngAnimate']);

HaxList.factory('Config', function() {
  return {
    testUrl: 'http://localhost:3000/test',
    loginUrl: 'http://localhost:3000/login/google',
    baseUrl: 'http://localhost:3000/',
    landingUrl: 'http://localhost:3000/haxlist'
  };
});

HaxList.factory('HaxService', function(Config, $http) {
  return {
    connectServer: function() {
      return $http.get(Config.testUrl);
    },

    login: function() {
      return $http.get('/login/google');
    }
  };
});

HaxList.controller('MainController', function($scope, $http, $location, HaxService, Config) {

  $scope.logIn = function() {
    window.location = Config.loginUrl;
  };

  $scope.logOut = function() {
    window.location = Config.baseUrl;
  };

  HaxService.connectServer().success(function(data) {
    $scope.hackers = data;
    console.log($scope.hackers);
  });
});
