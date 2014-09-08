var app = angular.module('social', []);

app.factory('abc', function() {
  return 'Brandon';
});

app.factory('friendFactory', ['$http', function($http) {
  return {
    getFriends: function() {
      return $http.get('/api/friends');
    }
  };
}]);

app.controller('test', ['$scope', 'friendFactory', function($scope, friendFactory) {
  friendFactory.getFriends().success(function(data) {
    $scope.friends = data.friends;
  });
}]);