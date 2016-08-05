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
      templateUrl: 'login.html',
      controller: 'MainController'
    })
    .when('', {
      teplateUrl: 'login.html',
      controller: 'MainController'
    }).otherwise({
      redirectTo: 'google.com'
    });
}]);

HaxList.factory('Config', function() {
  return {
    testUrl: 'http://localhost:3000/login',
    loginUrl: 'http://localhost:3000/login/google',
    baseUrl: 'http://localhost:3000/',
    landingUrl: 'http://localhost:3000/index',
    profileUrl: 'http://localhost:3000/profile'
  };
});

HaxList.factory('HaxService', function(Config, $http) {
  return {
    connectServer: function() {
      return $http.get(Config.baseUrl);
    },

    login: function() {
      return $http.get(Config.loginUrl);
    },

    logout: function() {
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

  HaxService.connectServer();
});
