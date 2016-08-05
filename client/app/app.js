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
      return $http.get(Config.baseUrl);
    },

    login: function() {
      return $http.get(Config.loginUrl);
    }
  };
});

HaxList.controller('MainController', function($scope, $http, HaxService) {

  HaxService.connectServer().success(function(data) {
    $scope.hackers = data;
    console.log($scope.hackers);
  });
});
