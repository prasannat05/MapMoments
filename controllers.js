app.controller('AuthController', function ($scope, $location, AuthService) {
  $scope.user = {};
  $scope.authMode = 'login';
  $scope.authError = '';

  $scope.toggleMode = function (mode) {
    $scope.authError = '';
    $scope.authMode = mode;
  };

  $scope.submit = function (welcomeForm) {
    $scope.authError = '';
    if ($scope.authMode === 'login') {
      if (welcomeForm.$invalid) {
        $scope.authError = "Please fill all required fields.";
        return;
      }
      if (AuthService.login($scope.user)) {
        $location.path('/home');
      } else {
        $scope.authError = "Invalid credentials. Please try again.";
      }
    } else {
      if (welcomeForm.$invalid) {
        $scope.authError = "Please fill all required fields.";
        return;
      }
      if ($scope.user.password !== $scope.user.confirmPassword) {
        $scope.authError = "Passwords do not match.";
        return;
      }
      if (!$scope.user.username || $scope.user.username.length < 3) {
        $scope.authError = "Username must be at least 3 characters.";
        return;
      }
      var result = AuthService.register($scope.user);
      if (result.error) {
        $scope.authError = result.error;
      } else {
        alert("Registered! Please log in.");
        $scope.authMode = 'login';
        $scope.user = {};
      }
    }
  };

  $scope.continueAsGuest = function () {
    AuthService.loginAsGuest();
    $location.path('/home');
  };
});

app.controller('HomeController', function ($scope, AuthService) {
  $scope.user = AuthService.getCurrentUser();
  $scope.isGuest = AuthService.isGuest();
});

app.controller('MapController', function ($scope, $location, FeedService) {
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
  $scope.selectZone = function (zoneName) {
    $scope.selectedZone = zoneName;
    FeedService.setSelectedZone(zoneName);
    $location.path('/feed');
  };
});

app.controller('FeedController', function ($scope, FeedService, AuthService) {
  $scope.selectedZone = FeedService.getSelectedZone();
  $scope.pings = FeedService.getPings($scope.selectedZone);

  $scope.isGuest = AuthService.isGuest();
  $scope.isAuthenticated = AuthService.isAuthenticated();
  $scope.react = function (ping, type) {
    ping.reactions[type]++;
    localStorage.setItem("mm_pings", JSON.stringify(FeedService.getAllPings()));
  };
  function getRemainingTime(expiryText, timestamp) {
    let expiryMinutes = 30;
    if (expiryText === '1 hr') expiryMinutes = 60;
    else if (expiryText === '2 hrs') expiryMinutes = 120;

    const expiryTime = new Date(timestamp).getTime() + expiryMinutes * 60000;
    const now = Date.now();
    const diff = expiryTime - now;

    if (diff <= 0) return "Expired";
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${mins}m ${secs}s`;
  }

  $scope.updateTimers = function () {
    $scope.pings.forEach(p => {
      p.timeLeft = getRemainingTime(p.expiry, p.timestamp);
    });
  };

  setInterval($scope.updateTimers, 1000);
  $scope.updateTimers();

});

app.controller('PostController', function ($scope, $location, FeedService, AuthService) {
  var user = AuthService.getCurrentUser();
  if (!user || AuthService.isGuest()) {
    alert("Login Required to post.");
    return $location.path('/home');
  }

  $scope.moment = {};
  $scope.postError = "";

  $scope.handleImage = function (element) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $scope.$apply(function () {
        $scope.moment.image = e.target.result;
      });
    };
    if (element.files[0]) reader.readAsDataURL(element.files[0]);
  };

  $scope.submitPost = function (postForm) {
    $scope.postError = "";
    if (postForm.$invalid) {
      $scope.postError = "Please fill all required fields.";
      return;
    }
    if (!$scope.moment.location || !$scope.moment.category || !$scope.moment.expiry) {
      $scope.postError = "All fields must be filled.";
      return;
    }
    $scope.moment.user = user.username;
    FeedService.addPing($scope.moment);
    $location.path('/feed');
  };
});

app.controller('ProfileController', function ($scope, AuthService, FeedService, $location) {
  var currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.isGuest) {
    $location.path('/home');
  }
  $scope.currentUser = currentUser;
  $scope.userPosts = FeedService.getAllPings().filter(function (p) {
    return p.user === currentUser.username;
  });
});

app.controller('SettingsController', function ($scope, AuthService, $location) {
  if (!AuthService.isAuthenticated()) {
    $location.path('/home');
  }
  $scope.settings = {};
});
