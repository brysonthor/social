angular.module('social').directive('newFriend', [function(newFriendService) {
  var styles = FS.File.loadCSS('newFriend.css');

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      scope.name = attrs.name;
      scope.id = attrs.id;
      // Popup Modal when
      $('.new-friend-modal').modal('show');
    }
  };
}]);