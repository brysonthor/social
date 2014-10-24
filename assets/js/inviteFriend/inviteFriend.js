angular.module('social').directive('inviteFriend', ['inviteFriendService', function(inviteFriendService) {
  var styles = FS.File.loadCSS('inviteFriend.css');

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // var template = '<input class="invite-email" type="text" placeholder="betty@gmail.com"><button class="btn btn-primary invite-button"><i class="icon icon-envelope icon-white"></i>Send Invite</button>';
      var template = getSnippets();
      var popover = $(element).popover({
        title: '<h3>Invite A Friend</h3>',
        html: true,
        content: template,
        placement: 'bottom'
      });

      // POST invite
      $('body').on('click', '.invite-button', function(e) {
        popover.popover('hide');
        var email = $('.invite-email').val();
        inviteFriendService.inviteUser({email: email}).error(function(data) {
          $('.page-alerts').html('Invite Failed').addClass('alert-danger');
        });
      });

      // This closes the popover when user clicks anywhere outside the popover
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