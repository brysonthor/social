angular.module('social').directive('getFriends', ['getFriendsService', '$compile', function(getFriendsService, $compile) {
  var styles = FS.File.loadCSS('getFriends.css');

  return {
    scope: { },
    restrict: 'A',
    compile: function compile(tElement, tAttrs, transclude) {
      // Needed the compile function to only inject template (modal window) just once into the DOM
      $('body').append($(getSnippets()));

      // Function runs for each instance of this directive
      return function(scope, element, attrs) {
      $compile($('.friend-friend-list-modal')[0])(scope);

        // Popup Modal
        $(element).on('click', function(e) {
          $('.friend-friend-list-modal').modal('show');

          // ajax call to get friends
          getFriendsService.getFriendList(attrs.getFriends).success(function(data) {
            scope.$apply(function(){
              scope.friends = data.friends;
            })
          });
        });
      };
    }
  };
}]);