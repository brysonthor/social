angular.module('social')
	.filter('cisid', function() {
		// Strips off the "cis.user." portion of a cis id
    return function(input, uppercase) {
      input = input || '';
      return input.split(".")[2];
    };
  })
  .controller('friendListCtrl', ['$scope', '$http', '$attrs', 'friendService', function($scope, $http, $attrs, friendService) {
	  friendService.getFriends($attrs.model).success(function(data) {
	    $scope.friends = data.friendList.friends;
	    FS.social.friends = data.friendList.friends;

	    if (typeof data.friendList.friends != "undefined") {
	    	$('.friend-list-owner').text("Friends of "+data.friendList.name+" ("+data.friendList.friends.length+")");
	  	} else {
		    // You have no friends
	  		$('.friend-list').html('<p class="no-friends">Invite your friends to begin sharing and collaborating with them on FamilySearch.</p>');	
	  	}
	  });
	}]);