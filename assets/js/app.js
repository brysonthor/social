angular.module('social', []);

angular.module('social').service('friendService', ['$http', function($http) {
  this.getFriends = function() {
    return $http.get('/api/friends');
  };
}]);

angular.module('social').controller('test', ['$scope', 'friendService', function($scope, friendService) {
  friendService.getFriends().success(function(data) {
    $scope.friends = data.friends;
  });
}]);