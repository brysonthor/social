angular.module('social').directive('peopleList', ['peopleListService', function(peopleListService) {
  var styles = FS.File.loadCSS('peopleList.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      peopleListService.getSharedPeople(attrs.peopleList).success(function(data) {
        scope.sharedPeople = data.sharedPeople;

        $('.shared-people-heading').append(" ("+data.sharedPeople.length+")");

        // Not sharing
        if (data.sharedPeople.length < 1) {
          $('.peoplelist-component').append("<p>No people are shared.</p>");
        }
      });
    }
  };
}]);