angular.module('social').directive('sharedPeople', ['sharedPeopleService', function(sharedPeopleService) {
  var styles = FS.File.loadCSS('sharedPeople.css');

  return {
    restrict: 'E',
    template: $(getSnippets()).html(),
    link: function(scope, element, attrs) {
      var userId = attrs.data;

      // Popup Modal when
      $('.shared-people').on('click', function(e) {
        $('.shared-people-modal').modal('show');

        // Don't fetch data again if we already have it
        if ($('.people-list li').length > 0) return;

        // Get user's people list
        sharedPeopleService.getPeople(userId).success(function(data) {
          for (var i=0; i< data.taggedPerson.length; i++) {
            var person = $(templateList.person);
            var portrait = data.taggedPerson[i].thumbIconUrl;
            if (data.taggedPerson[i].thumbIconUrl == null) portrait = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            $(person).find('img').attr('src',portrait);
            $(person).find('label').append(data.taggedPerson[i].name);
            $('.people-list').append(person);
          }
        });
      });
    }
  };
}]);