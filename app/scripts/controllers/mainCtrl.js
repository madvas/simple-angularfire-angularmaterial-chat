'use strict';

angular.module('simple-angularfire-material-chat')
  .controller('MainCtrl', function($scope, $mdSidenav, Auth, $mdDialog, $firebaseArray, RootRef, $firebaseObject,
                                   $state) {
    $scope.auth = Auth;
    var roomMetaRef = RootRef.child('room-metadata');
    $scope.rooms = $firebaseArray(roomMetaRef.orderByChild('created'));

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      $scope.currentRoomName = toParams.roomName;
    });

    $scope.addRoomDialog = function(ev) {
      $mdDialog.show({
        controller  : AddRoomController,
        templateUrl : 'views/add-room.html',
        targetEvent : ev
      }).then(function(newRoomName) {
        var newRoomObj = $firebaseObject(roomMetaRef.child(newRoomName));
        newRoomObj.createdByUserId = Auth.data.uid;
        newRoomObj.created = Firebase.ServerValue.TIMESTAMP;
        newRoomObj.$save();
        $state.go('main.room', {roomName : newRoomName});
      });
    };

    function AddRoomController($scope, $mdDialog) {
      $scope.mdDialog = $mdDialog;
    }
  });
