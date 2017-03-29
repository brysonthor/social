angular.module('social').directive('composeMessage', ['composeMessageService', function(composeMessageService) {

  var convertDataToMessage = function (data) {
    if(data.toIds.indexOf(FS.User.profile.cisId) == -1) {
      data.toIds.push(FS.User.profile.cisId);
    }
    return {
      "participantIds" : data.toIds,
      "subject" : data.subject,
      "firstMessage" : {
        "authorId" : FS.User.profile.cisId,
        "body" : data.body
      }
    };
  };

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
        var unread = rsp.totalUnreadMsgs;
        if (unread) $('.subnav_messages').parent().append('<span class="fs-badge fs-badge--dark message-count">'+unread+'</span>');
        var title= ' '+$('.subnav_messages').attr('title');
        $('.subnav_messages').attr('title', rsp.totalMsgs+title);
      });

      // Send Message
      scope.sendMsg = function() {
        var data = {
          toIds: [$('.message-to-list').val()],
          subject: $('.message-subject-input').val(),
          body: $('.message-body-input').val()
        };
        var message = convertDataToMessage(data);
        composeMessageService.sendMessage(message).success(function(data) {
          // console.log(data);
        });
      }

    }
  };
}]);