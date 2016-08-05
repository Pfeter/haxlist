var HaxList = angular.module('HaxList', ['ngAnimate']);

HaxList.factory('Config', function() {
  return {
    testUrl: 'http://localhost:3000/test'
  };
});

HaxList.factory('HaxService', function(Config, $http) {
  return {
    testServer: function() {
      return $http.get(Config.testUrl);
    }
  };
});

HaxList.controller('MainController', function($scope, $http, HaxService) {

  HaxService.testServer().success(function(data) {
    $scope.haxlist = data;
    console.log($scope.haxlist);
  });
});
