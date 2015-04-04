'use strict';

angular.module('simple-angularfire-material-chat')
  .controller('RoomCtrl', function($scope, $stateParams, $mdSidenav, $firebaseArray, RootRef, $firebaseObject, Auth,
                                   $mdDialog, $state) {
    var ctrl = this;
    var messagesRef = RootRef.child('room-messages').child($stateParams.roomName);
    var roomUsersRef = RootRef.child('room-users').child($stateParams.roomName);
    var roomUserRef;
    $scope.pageSize = 25;
    $scope.page = 1;
    $scope.roomName = $stateParams.roomName;

    $scope.currentRoom = $firebaseObject(RootRef.child('room-metadata').child($scope.roomName));
    $scope.roomUsers = $firebaseArray(roomUsersRef);

    ctrl.getMessages = function() {
      $scope.messages = $firebaseArray(messagesRef.limitToLast($scope.pageSize * $scope.page));
    };

    ctrl.getMessages();

    var detachOnAuth = Auth.authObj.$onAuth(function(authData) {
      if (!authData) {
        return;
      }
      roomUserRef = roomUsersRef.child(authData.uid);
      roomUserRef.set(true);
      roomUserRef.onDisconnect().remove(); // User disconnected
    });

    Auth.onBeforeUnauth(function() {
      // User wants to sign out, he must remove himself from room firstly
      // because only him has permissions to do so
      roomUserRef.remove();
    });

    $scope.$on("$destroy", function() {
      roomUserRef.remove(); // User navigates out of the room
      detachOnAuth();
    });

    $scope.sendMessage = function(form) {
      $scope.messages.$add({
        message   : $scope.newMessageText,
        username  : $scope.auth.username,
        timestamp : Firebase.ServerValue.TIMESTAMP
      });
      $scope.newMessageText = '';
      form.$setUntouched();
    };

    $scope.isOwner = function() {
      if (Auth.data) {
        return $scope.currentRoom.createdByUserId === Auth.data.uid;
      }
      return false;
    };

    $scope.showOlder = function() {
      $scope.page += 1;
      ctrl.getMessages();
    };

    $scope.deleteRoomDialog = function(ev) {
      var confirm = $mdDialog.confirm()
        .title('Do you really want to remove room ' + $scope.currentRoom.$id)
        .ok('Please do it!')
        .cancel('Nope')
        .targetEvent(ev);
      $mdDialog.show(confirm).then(function() {
        ctrl.removeRoom();
        $state.go('main.room', {roomName : 'general'});
      });
    };

    this.removeRoom = function() {
      $scope.currentRoom.$remove();
      messagesRef.remove();
    };

    $scope.toggleRoomsSidenav = function() {
      $mdSidenav('rooms-sidenav').toggle();
    };

    $scope.$on('$stateChangeSuccess', function() {
      $mdSidenav('rooms-sidenav').close();
    });
  });
