'use strict';

angular.module('simple-angularfire-material-chat')
  .controller('HeaderCtrl', function($scope, Auth) {
    $scope.auth = Auth;
  });
