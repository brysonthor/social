angular.module('social').directive('composeMessage', ['composeMessageService', function(composeMessageService) {
  var styles = FS.File.loadCSS('composeMessage.css');

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Popup Modal when
      $('.compose-message').on('click', function(e) {
        $('.compose-message-modal').modal('show');

        composeMessageService.getFriends(attrs.data, function (data) {
          scope.people = data;
        });
      });

      composeMessageService.getMailboxCount().success(function(rsp) {
        console.log(rsp);
      });

      // Send Message
      scope.sendMsg = function() {
        var message = {
          subject: $('.message-subject-input').val(),
          body: $('.message-body-input').val(),
          // meta: { "u2ms:about":"Verland Elmer 1920-2014" },
          deleteAbout: false,
          // toUsers: [{ "userName": "misbach", "id": $('.message-to-input').val(), "password": "1234pass", "name": "Matt"}],
          toUserIds: [$('.message-to-input').val()]
        };
        composeMessageService.sendMessage(message).success(function(data) {
        });
      }

    }
  };
}]);