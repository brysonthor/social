angular.module('social').directive('peopleList', ['peopleListService', function(peopleListService) {

  return {
    restrict: 'A',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      peopleListService.getSharedPeople(attrs.peopleList).success(function(data) {
        scope.sharedPeople = data.sharedPeople;
        if (typeof data.sharedPeople != "undefined" && data.sharedPeople.length > 0) {
          $('.shared-people-heading').append(" ("+data.sharedPeople.length+")");
          $('.shared-count').text(data.sharedPeople.length);
        } else {
          $('.peoplelist-component').append('<center><br><br><p>You have not shared anything.</p></center>');
        }
      });
    }
  };
}]);