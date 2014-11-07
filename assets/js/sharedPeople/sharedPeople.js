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

        sharedPeopleService.getPeople(attrs.data, function (data) {
          scope.people = data;
        });
      });

      scope.savePeople = function() {
        sharedPeopleService.savePeople(scope.people).success(function(data) {
        });
      }

    }
  };
}]);