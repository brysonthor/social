angular.module('social').directive('sharedPeople', ['sharedPeopleService', function(sharedPeopleService) {
  return {
    restrict: 'E',
    template: '<button class="btn btn-success pull-right shared-people">Share Memories</button><div class="shared-people-modal modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">  <div class="modal-header">    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>    <h3 id="myModalLabel">Shared Memory People</h3>  </div>  <div class="modal-body"> <ul class="people-list"></ul> </div>  <div class="modal-footer">    <button class="btn btn-link" data-dismiss="modal" aria-hidden="true">Cancel</button>    <button class="btn btn-primary">Save changes</button>  </div></div>',
    link: function(scope, element, attrs) {
      var userId = attrs.data;

      $('.shared-people').on('click', function(e) {
        $('.shared-people-modal').modal('show');
        sharedPeopleService.getPeople(userId).success(function(data) {
          for (var i=0; i<= data.taggedPerson.length; i++) {
            $('.people-list').append('<li><label class="checkbox"><input type="checkbox"><img class="people-list-portriat" src="'+data.taggedPerson[i].thumbIconUrl+'">'+data.taggedPerson[i].name+'</label></li>');
          }
        });
      });

    }
  };
}]);