angular.module('social').controller('friendListCtrl', ['$scope', 'friendService', function($scope, friendService) {
  friendService.getFriends({ sessionId: "USYSCA579924A1EED93A80B4463F45D7A29E_idses-refa04.a.fsglobal.net"}).success(function(data) {
    $scope.friends = data.friends;
  });
}]);