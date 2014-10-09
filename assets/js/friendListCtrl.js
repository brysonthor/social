angular.module('social').controller('friendListCtrl', ['$scope', 'friendService', function($scope, friendService) {
  friendService.getFriends().success(function(data) {
    $scope.friends = data.friends;

    // You have no friends
    if (data.friends.length == 0) $('.friend-list').append('<p class="no-friends">Invite your friends to begin sharing and collaborating with them on FamilySearch.</p>');
  });
}]);