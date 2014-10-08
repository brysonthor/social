angular.module('social').directive('userPortrait', ['currentUserService', function(currentUserService) {
  return {
    restrict: 'E',
    template: '<img class="user-portrait" src="{{source}}">',
    link: function(scope, element, attrs) {
      var userId = attrs.value;
      // Get the user's tree PID
      currentUserService.getCurrentUser(userId).success(function(data) {
        // Stuff the portrait URL into the IMG tag source
        scope.source = "/platform/tree/persons/"+data.persons[0].id+"/portrait";
      });
    }
  };
}]);