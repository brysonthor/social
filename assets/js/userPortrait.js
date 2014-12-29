angular.module('social').directive('userPortrait', ['currentPersonService', function(currentPersonService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // Get the user's tree PID and then portrait URL
      currentPersonService.getCurrentPerson().success(function(data) {
        // TODO: Get the actual jpg url. If none exist use sillouette
        $(element).attr('src',"/platform/tree/persons/"+data.persons[0].id+"/portrait");
        $('.banner-background').css('background-image', 'url("/platform/tree/persons/'+data.persons[0].id+'/portrait")');
      });
    }
  };
}]);