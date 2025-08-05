var app = angular.module('mapMomentsApp', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthController'
    })
    .when('/map', {
      templateUrl: 'views/map.html',
      controller: 'MapController'
    })
    .when('/post', {
      templateUrl: 'views/post.html',
      controller: 'PostController'
    })
    .when('/feed', {
      templateUrl: 'views/feed.html',
      controller: 'FeedController'
    })
    .otherwise({
      redirectTo: '/login'
    });
});

// Simple in-memory Auth for demo purposes
app.factory('AuthService', function() {
  var users = [];
  var currentUser = null;
  return {
    login: function(user) {
      var found = users.find(u => u.email === user.email && u.password === user.password);
      if (found) {
        currentUser = found;
        return true;
      }
      return false;
    },
    register: function(user) {
      users.push({ email: user.email, username: user.username, password: user.password });
    },
    getCurrentUser: function() {
      return currentUser;
    }
  };
});

app.factory('FeedService', function() {
  var pings = [];
  var selectedZone = 'Canteen';
  return {
    addPing: function(data) {
      data.user = data.user || 'Anonymous';
      data.timestamp = new Date();
      pings.push(data);
      selectedZone = data.location;
    },
    getSelectedZone: function() {
      return selectedZone;
    },
    setSelectedZone: function(zone) {
      selectedZone = zone;
    },
    getPings: function(zone) {
      return pings.filter(p => p.location === zone);
    }
  };
});

// For better navigation and global avatar
app.run(function($rootScope, AuthService, $location) {
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.currentUser = AuthService.getCurrentUser();
    $rootScope.goHome = function() {
      $location.path('/map');
    }
    $rootScope.$location = $location;
  });
});
