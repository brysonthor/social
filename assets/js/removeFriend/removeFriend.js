angular.module('social').directive('removeFriend', ['removeFriendService', function(removeFriendService) {

  return {
    restrict: 'A',
    compile: function compile(tElement, tAttrs, transclude) {
      // Needed the compile function to only inject template (modal window) just once into the DOM
      $('body').append($(getSnippets()));

      // Function runs for each instance of this directive
      return function(scope, element, attrs) {
        // Popup Modal
        $(element).on('click', function(e) {
          $('.friend-name').text(attrs.handle);
          $('.remove-friend-modal').modal('show');

          // ajax: Remove friend
          $('.remove-friend-btn').on('click', function() {
            // Remove friend fromm DOM
            $(element).parent().fadeOut(2000);

            // ajax call to delete friend
            removeFriendService.remove(attrs.removeFriend).error(function(data) {
              $('.page-alerts').html('Remove Friend Failed').addClass('alert-danger');
            });
          })
        });
      };
    }
  };
}]);