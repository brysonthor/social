angular.module('social').directive('inviteFriend', ['userPortraitService', function(userPortraitService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var template = '<input class="invite-email" type="text" placeholder="betty@gmail.com"><button class="btn btn-primary invite-button"><i class="icon icon-envelope icon-white"></i>Send Invite</button>';
      $(element).popover({
        title: '<h3>Invite A Friend</h3>',
        html: true,
        content: template,
        placement: 'bottom'
      });
    }
  };
}]);