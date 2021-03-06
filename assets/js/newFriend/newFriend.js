angular.module('social').directive('newFriend', [function(newFriendService) {

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      scope.name = attrs.name;
      scope.id = attrs.id;
      scope.srcUrl = FS.File.img('sharinggraphic.svg');
      // Popup Modal when
      $('.new-friend-modal').modal('show');
    }
  };
}]);