angular.module('social').directive('userPortrait', ['userPortraitService', function(userPortraitService) {
  return {
    restrict: 'E',
    template: '<img class="user-portrait" src="{{source}}">',
    link: function(scope, element, attrs) {
      var userId = attrs.value;
      userPortraitService.getUserPortrait(userId).success(function(data) {
        scope.source = "/platform/tree/persons/"+data.persons[0].id+"/portrait";
      });
    }
  };
}]);