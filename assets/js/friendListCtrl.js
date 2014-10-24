angular.module('social').controller('friendListCtrl', ['$scope', '$http', 'friendService', function($scope, $http, friendService) {
  friendService.getFriends().success(function(data) {
    $scope.friends = data.friends;

    // You have no friends
    if (data.friends.length == 0) {
     $('.friend-list').html('<p class="no-friends">Invite your friends to begin sharing and collaborating with them on FamilySearch.</p>');
    }
  });

}]);