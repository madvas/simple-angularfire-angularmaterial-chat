'use strict';

/**
 * @ngdoc overview
 * @name simple-angularfire-material-chat
 * @description
 * # simple-angularfire-material-chat
 *
 * Main module of the application.
 */
angular
  .module('simple-angularfire-material-chat', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ui.router',
    'firebase',
    'angularMoment',
    'luegg.directives'
  ])
  .constant('RootRef', new Firebase('https://simple-material-chat.firebaseio.com'))
  .config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
      .state('main', {
        abstract    : true,
        url         : '/',
        templateUrl : 'views/main.html',
        controller  : 'MainCtrl'
      })
      .state('main.room', {
        url         : 'room/:roomName',
        templateUrl : 'views/room.html',
        controller  : 'RoomCtrl'
      });

    $urlRouterProvider.otherwise('/room/general');

    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('red');
  })
  .run(function(Auth) {
    if (!Auth.isAuthenticated()) {
      Auth.authAnonymously();
    }
  });
