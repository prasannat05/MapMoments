var app = angular.module('mapMomentsApp', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/welcome.html',
      controller: 'AuthController'
    })
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/map', {
      templateUrl: 'views/map.html',
      controller: 'MapController'
    })
    .when('/feed', {
      templateUrl: 'views/feed.html',
      controller: 'FeedController'
    })
    .when('/post', {
      templateUrl: 'views/post.html',
      controller: 'PostController'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileController'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Persistent Auth using localStorage
app.factory('AuthService', function() {
  var users = JSON.parse(localStorage.getItem('mm_users') || '[]');
  var sessionKey = 'mm_currentUser';

  function saveUsers() {
    localStorage.setItem('mm_users', JSON.stringify(users));
  }
  function saveSession(user) {
    localStorage.setItem(sessionKey, JSON.stringify(user));
  }
  function loadSession() {
    return JSON.parse(localStorage.getItem(sessionKey) || 'null');
  }

  return {
    login: function(user) {
      var found = users.find(u => u.email === user.email && u.password === user.password);
      if (found) {
        saveSession(found);
        return true;
      }
      return false;
    },
    register: function(user) {
      if (users.some(u => u.email === user.email))
        return {error: "Email already registered"};
      if (users.some(u => u.username === user.username))
        return {error: "Username already taken"};
      var newUser = { email: user.email, username: user.username, password: user.password };
      users.push(newUser);
      saveUsers();
      return { success: true };
    },
    loginAsGuest: function() {
      var guestUser = { username: 'Guest', email: 'guest@campus.com', isGuest: true };
      saveSession(guestUser);
    },
    getCurrentUser: function() {
      return loadSession();
    },
    logout: function() {
      localStorage.removeItem(sessionKey);
    },
    isGuest: function() {
      var u = loadSession();
      return u && u.isGuest === true;
    },
    isAuthenticated: function() {
      var u = loadSession();
      return !!(u && !u.isGuest);
    },
    getAllUsers: function() {
      return users;
    }
  };
});

app.factory('FeedService', function() {
  var key = "mm_pings";
  var pings = JSON.parse(localStorage.getItem(key) || "[]");
  var selectedZone = localStorage.getItem("mm_selectedZone") || null;

  function savePings() {
    localStorage.setItem(key, JSON.stringify(pings));
  }
  function saveZone(zone) {
    localStorage.setItem("mm_selectedZone", zone);
  }

  return {
    addPing: function(data) {
      data.user = data.user || 'Anonymous';
      data.timestamp = new Date();
      pings.push(data);
      savePings();
      selectedZone = data.location;
      saveZone(selectedZone);
    },
    getSelectedZone: function() {
      return selectedZone;
    },
    setSelectedZone: function(zone) {
      selectedZone = zone;
      saveZone(selectedZone);
    },
    getPings: function(zone) {
      return pings.filter(p => p.location === zone);
    },
    getAllPings: function() {
      return pings;
    }
  };
});

app.run(function($rootScope, AuthService, $location) {
  function setNav() {
    $rootScope.currentUser = AuthService.getCurrentUser();
    $rootScope.isGuest = AuthService.isGuest();
    $rootScope.isAuthenticated = AuthService.isAuthenticated();
  }
  
  setNav();

  $rootScope.goHome = function() {
    $location.path('/home');
  };

  $rootScope.goProfile = function() {
    if ($rootScope.currentUser && !$rootScope.isGuest) {
      $location.path('/profile');
    } else {
      $location.path('/home');
    }
  };

  $rootScope.logout = function() {
    AuthService.logout();
    setNav();
    $location.path('/');
  };

  $rootScope.$on('$routeChangeStart', function() {
    setNav();
  });
});
