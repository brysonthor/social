angular.module('social').directive('userPortrait', ['currentUserService', function(currentUserService) {
  return {
    restrict: 'E',
    template: '<img class="user-portrait" src="{{source}}">',
    link: function(scope, element, attrs) {
      // Get the user's tree PID
      currentUserService.getCurrentUser().success(function(data) {
        // Stuff the portrait URL into the IMG tag source
        // TODO: Get the actual jpg url. If none exist use sillouette
        scope.source = "/platform/tree/persons/"+data.persons[0].id+"/portrait";
      });
    }
  };
}]);