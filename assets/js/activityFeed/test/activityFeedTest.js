describe('activityFeed', function() {"use strict";
  beforeEach(angular.mock.module("activityFeedService"));

  describe('activityFeedService', function() {
    var scope,
    $httpBackend, 
    $q, 
    $rootScope, 
    $window, 
    activityFeedService = {}, 
    $provide;

    beforeEach(function() {
      angular.mock.module(function(_$provide_) {
        $provide = _$provide_;
        $provide.value("activityFeedService", activityFeedService);
      });

      inject(function(_$httpBackend_,
         _$rootScope_, 
         _activityFeedService_,
         $controller, 
         _$q_, 
         _$window_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        $window = _$window_;
        scope = $rootScope.$new();
        // groupProfileSettings = $controller("GroupProfileSettings", {
          $scope : scope
        });
    
        $httpBackend = _$httpBackend_;
        // $httpBackend.resetExpectations();
        scope.activityFeedService = _activityFeedService_;
        scope.userId = 'cis.user.MMMM-ABCD';
      });

    });

    it("should exist and have a Group Profile Controller", function() {
      expect(scope.activityFeedService.getFeed).to.be.a("function");
    });

    it("should load Group Details for a user", function() {
      scope.getFeed(scope.userId);
    }); 

  });
});
