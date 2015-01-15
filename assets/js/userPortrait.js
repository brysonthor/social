angular.module('social').directive('userPortrait', ['currentPersonService', 'friendService', function(currentPersonService, friendService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // If viewing a friend page, get portriat from user's friend list
      if (attrs.userPortrait != FS.social.profile.id) {
        // Find portrait of friend in my friend list
        friendService.getFriends(FS.social.profile.id).success(function(data) {
          for (var i=0; i< data.friendList.friends.length; i++) {
            if (data.friendList.friends[i].user_id == attrs.userPortrait) {
              $(element).attr('src',data.friendList.friends[i].portrait);
              $('.user-name').text(data.friendList.friends[i].display_name);
            }
          }
        });
      } else {
        // Get the current logged in user's tree PID and then portrait URL
        currentPersonService.getCurrentPerson().success(function(data) {
          // TODO: Get the actual jpg url. If none exist use sillouette
          $(element).attr('src',"/platform/tree/persons/"+data.persons[0].id+"/portrait");
        });
      }
    }
  };
}]);