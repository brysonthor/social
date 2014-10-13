angular.module('social').directive('inviteFriend', ['inviteFriendService', function(inviteFriendService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var template = '<input class="invite-email" type="text" placeholder="betty@gmail.com"><button class="btn btn-primary invite-button"><i class="icon icon-envelope icon-white"></i>Send Invite</button>';

      var popover = $(element).popover({
        title: '<h3>Invite A Friend</h3>',
        html: true,
        content: template,
        placement: 'bottom'
      });

      // POST invite
      $('body').on('click', '.invite-button', function(e) {
        $('.invite-button').attr('disabled',true);
        var email = $('.invite-email').val();
        inviteFriendService.inviteUser({email: email}).success(function(data) {
          popover.popover('hide');
        });
      });

      // This closes the popover when user clicks anywhere outside the popover
      // TODO: This fires every time a cick happens anywhere
      $('body').on('click', function (e) {
        $(element).each(function () {
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
          }
        });
      });

    }
  };
}]);