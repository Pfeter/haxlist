var HaxList = angular.module('HaxList', ['ngAnimate', 'ngRoute']);

HaxList.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/training', {
      templateUrl: 'training.html',
      controller: 'MainController'
    })
    .when('/profile', {
      templateUrl: 'profile.html',
      controller: 'MainController'
    })
    .when('/login', {
      templateUrl: 'index.html',
      controller: 'MainController'
    }).otherwise({
      redirectTo: '/login'
    });
}]);

HaxList.factory('Config', function() {
  return {
    testUrl: 'http://localhost:3000/test',
    loginUrl: 'http://localhost:3000/login/google',
    baseUrl: 'http://localhost:3000/',
    landingUrl: 'http://localhost:3000/index'
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

HaxList.controller('MainController', function($scope, $http, $location, HaxService, Config) {

  $scope.logIn = function() {
    window.location = Config.loginUrl;
  };

  $scope.logOut = function() {
    window.location = Config.landingUrl;
  };

  HaxService.connectServer().success(function(data) {
    $scope.hackers = data;
    console.log($scope.hackers);
  });
});
