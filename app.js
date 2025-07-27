var app = angular.module('mapMomentsApp', ['ngRoute']);

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
