angular.module('social').directive('composeMessage', ['composeMessageService', function(composeMessageService) {
  var styles = FS.File.loadCSS('composeMessage.css');

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Show new message modal & populate "to" dropdown
      $('.compose-message').on('click', function(e) {
        $('.compose-message-modal').modal('show');
        if ($('.message-to-list option').size() < 1) {
          for (var i=0; i<FS.social.friends.length; i++) {
            var friend = FS.social.friends[i];
            $('.message-to-list').append('<option value="'+friend.user_id+'">'+friend.display_name+'</option>');
          }
        }
      });

      // Get mailbox count
      composeMessageService.getMailboxCount().success(function(rsp) {
        var unread = rsp.totalUnreadMessages;
        if (unread) $('.subnav_messages').parent().append('<span class="fs-badge fs-badge--dark message-count">'+unread+'</span>');
        var title= ' '+$('.subnav_messages').attr('title');
        $('.subnav_messages').attr('title', rsp.totalMessages+title);
      });

      // Send Message
      scope.sendMsg = function() {
        var message = {
          subject: $('.message-subject-input').val(),
          body: $('.message-body-input').val(),
          // meta: { "u2ms:about":"Verland Elmer 1920-2014" },
          deleteAbout: false,
          // toUsers: [{ "userName": "misbach", "id": $('.message-to-input').val(), "password": "1234pass", "name": "Matt"}],
          toUserIds: [$('.message-to-list').val()]
        };
        composeMessageService.sendMessage(message).success(function(data) {
          // console.log(data);
        });
      }

    }
  };
}]);