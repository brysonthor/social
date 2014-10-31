angular.module('social').controller('friendListCtrl', ['$scope', '$http', '$attrs', 'friendService', function($scope, $http, $attrs, friendService) {

  friendService.getFriends($attrs.model).success(function(data) {
    $scope.friends = data.friends;

    // You have no friends
    if (data.friends.length == 0) {
     $('.friend-list').html('<p class="no-friends">Invite your friends to begin sharing and collaborating with them on FamilySearch.</p>');
    }
  });

}]);