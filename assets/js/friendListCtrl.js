angular.module('social').controller('friendListCtrl', ['$scope', 'friendService', function($scope, friendService) {
  friendService.getFriends().success(function(data) {
    $scope.friends = data.friends;
  });
}]);