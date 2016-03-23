'use strict';

/**
 * @ngdoc overview
 * @name friendappApp
 * @description
 * # friendappApp
 *
 * Main module of the application.
 */
angular
  .module('friendappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angucomplete',
    'appServices'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(['$rootScope', '$window', 'AuthService', function($rootScope, $window, AuthService) {
      $rootScope.user = {};
      $window.fbAsyncInit = function() {
      // Executed when the SDK is loaded
          FB.init({
              appId: '1889101614649571',
              channelUrl: 'template/channel.html',
              status: true,
              cookie: true,
              xfbml: true,
              version: 'v2.4'
          });
      AuthService.watchLoginChange();
  };
  (function(){
      var e = document.createElement('script'); e.async = true;
      e.src = document.location.protocol +
      '//connect.facebook.net/en_US/all.js';
      document.getElementById('fb-root').appendChild(e);
  }());

  }]);
