angular.module('social').directive('peopleList', ['peopleListService', function(peopleListService) {
  var styles = FS.File.loadCSS('peopleList.css');

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      peopleListService.getSharedPeople(attrs.peopleList).success(function(data) {
        scope.sharedPeople = data.sharedPeople;
        if (typeof data.sharedPeople != "undefined") {
          $('.shared-people-heading').append(" ("+data.sharedPeople.length+")");
          $('.shared-count').text(data.sharedPeople.length);
        } else {
          $('.peoplelist-component').append("<p>No people are shared.</p>");
        }
      });
    }
  };
}]);