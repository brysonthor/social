angular.module('social').directive('sharedPeople', ['sharedPeopleService', function(sharedPeopleService) {
  var styles = FS.File.loadCSS('sharedPeople.css');

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      // Popup Modal when
      $('.shared-people').on('click', function(e) {
        $('.shared-people-modal').modal('show');

        // Don't fetch data again if we already have it
        if ($('.people-list li').length > 0) return;

        // Get user's people list
        sharedPeopleService.getPeople(attrs.data).success(function(data) {
          scope.people = data.taggedPerson;
        });
      });
    }
  };
}]);