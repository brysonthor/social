angular.module('social').controller('friendListCtrl', ['$scope', '$http', 'friendService', function($scope, $http, friendService) {
  friendService.getFriends().success(function(data) {
    $scope.friends = data.friends;

    // You have no friends
    if (data.friends.length == 0) $('.friend-list').append('<p class="no-friends">Invite your friends to begin sharing and collaborating with them on FamilySearch.</p>');
  });

  // Remove a friend
  $scope.removeFriend = function(id) {
  	$http.delete('api/remove/'+id).success(function(rsp){
  		console.log(rsp);
  	});
  	// Remove friend from DOM
		for (var i =0; i<= $scope.friends.length; i++) {
			if (typeof $scope.friends[i] == "undefined") continue;
			if ($scope.friends[i].user_id == id) $scope.friends.splice(i,1);
		}
  }

}]);