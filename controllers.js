app.controller('AuthController', function($scope) {
  // Handle login/register form logic here
});

app.controller('MapController', function($scope) {
  $scope.zones = [
    { name: 'Library', code: 'L' },
    { name: 'IT Block', code: 'I' },
    { name: 'CSE Block', code: 'C' },
    { name: 'Main Block', code: 'M' },
    { name: 'Auditorium KS', code: 'A' },
    { name: 'Ground', code: 'G' },
    { name: 'Canteen', code: 'Ct' }
  ];

  $scope.zoneInfo = {
    "Library": "The library houses thousands of books and offers quiet study spaces.",
    "IT Block": "IT Block includes computer labs, server rooms, and tech offices.",
    "CSE Block": "CSE Block is home to computer science classrooms and faculty offices.",
    "Main Block": "Main Block contains administrative offices and the main entrance.",
    "Auditorium KS": "The auditorium hosts cultural events and guest lectures.",
    "Ground": "The ground is used for sports and outdoor events.",
    "Canteen": "The canteen offers a variety of snacks and refreshments."
  };

  $scope.selectedZone = null;
  $scope.selectZone = function(zone) {
    $scope.selectedZone = zone;
  };
});

app.controller('PostController', function($scope, $location, FeedService) {
  $scope.moment = {};

  $scope.submitPost = function() {
    FeedService.addPing($scope.moment);
    $location.path('/feed');
  };
});

app.controller('FeedController', function($scope, FeedService) {
  $scope.selectedZone = FeedService.getSelectedZone();
  $scope.pings = FeedService.getPings($scope.selectedZone);
});

app.factory('FeedService', function() {
  var pings = [];
  var selectedZone = 'Canteen';

  return {
    addPing: function(data) {
      data.user = 'Anonymous';
      pings.push(data);
      selectedZone = data.location;
    },
    getSelectedZone: function() {
      return selectedZone;
    },
    getPings: function(zone) {
      return pings.filter(p => p.location === zone);
    }
  };
});
