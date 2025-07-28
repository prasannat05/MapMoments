app.controller('AuthController', function($scope, $location, AuthService) {
  $scope.user = {};
  $scope.login = function() {
    if (AuthService.login($scope.user)) {
      $location.path('/map');
    } else {
      alert("Invalid credentials");
    }
  };
  $scope.register = function() {
    if ($scope.user.password !== $scope.user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    AuthService.register($scope.user);
    $location.path('/login');
  };
});

app.controller('MapController', function($scope, $location, FeedService) {
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
  $scope.selectZone = function(zoneName) {
    $scope.selectedZone = zoneName;
    FeedService.setSelectedZone(zoneName);
    $location.path('/feed');
  };
});

app.controller('PostController', function($scope, $location, FeedService, AuthService) {
  $scope.moment = {};
  $scope.handleImage = function(element) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $scope.$apply(function() {
        $scope.moment.image = e.target.result;
      });
    };
    if (element.files[0]) reader.readAsDataURL(element.files[0]);
  };
  $scope.submitPost = function() {
    var user = AuthService.getCurrentUser();
    $scope.moment.user = user ? user.username : 'Anonymous';
    FeedService.addPing($scope.moment);
    $location.path('/feed');
  };
});

app.controller('FeedController', function($scope, FeedService) {
  $scope.selectedZone = FeedService.getSelectedZone();
  $scope.pings = FeedService.getPings($scope.selectedZone);
});
