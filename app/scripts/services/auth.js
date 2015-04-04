'use strict';

angular.module('simple-angularfire-material-chat')
  .factory('Auth', function(RootRef, $firebaseAuth, Toast) {
    var auth = $firebaseAuth(RootRef);
    var beforeUnauthCallbacks = [];

    var me = {
      user            : false,
      authObj         : auth,
      signout         : function() {
        _.each(beforeUnauthCallbacks, _.partial(_.attempt));
        auth.$unauth();
      },
      signin          : function() {
        _.each(beforeUnauthCallbacks, _.partial(_.attempt));
        auth.$authWithOAuthPopup("github").then(function(authData) {
          Toast.show('Welcome to Party ' + authData.github.username + '!');
        }).catch(function(error) {
          Toast.show('Login Failed! ' + error);
        });
      },
      isAuthenticated : function() {
        return !!auth.$getAuth();
      },
      authAnonymously : function() {
        auth.$authAnonymously().catch(function(error) {
          Toast.show('Login Failed! ' + error);
        });
      },
      onBeforeUnauth  : function(callback) {
        beforeUnauthCallbacks.push(callback);
      }
    };

    auth.$onAuth(function(authData) {
      if (!authData) {
        // Chat can't be used, when completely unauthenticated, so after signout we signin as anonymous
        me.authAnonymously();
        return;
      }
      if (authData.github) {
        me.username = authData.github.username;
        me.isAnonymous = false;
      } else {
        me.username = 'guest' + authData.uid.substr(-3);
        me.isAnonymous = true;
      }
      me.data = authData;
    });

    return me;
  });
