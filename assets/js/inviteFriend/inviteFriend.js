angular.module('social').directive('inviteFriend', ['inviteFriendService', function(inviteFriendService) {
  var styles = FS.File.loadCSS('inviteFriend.css');

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
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
        inviteFriendService.inviteUser({email: email})
        .success(function(rsp) {
          $('.no-invites').remove();
          $('.invites-list').append('<li>'+email+'</li>');
          $('.invite-email').val("");
        })
        .error(function(data) {
          $('.page-alerts').html('Invite Failed').addClass('alert-danger');
        });
      });

      // Get all pending invites from this user
      var invites = [];
      inviteFriendService.pendingInvitations().success(function(rsp) {
        invites = rsp.invites;
        if (invites.length == 0) $('.no-invites').removeClass('hide');
        $('.show-pending').hide();
        for (var i=0; i<invites.length; i++) {
          $('.invites-list').append('<li>'+invites[i].friend_email+'</li>');
        }
        $('.outgoing-invites-count').text(invites.length);
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