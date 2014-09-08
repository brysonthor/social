var app = angular.module('social', []);

app.controller('test', ['$scope', 'friendService', function($scope, friendService) {
  $scope.friends = friendService.getData();
}]);

app.factory('friendService', function() {
  var newService = {
    data: ['a', 'b', 'zzz'],

    getData: function () {
      return data;
    }
  };

  return newService;
});