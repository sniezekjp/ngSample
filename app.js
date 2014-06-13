




//Init anuglar app, we'll be using ui.router in replace of ngRoute
var app = angular.module('APP', ['ui.router', 'ngCookies', 'ngSanitize', 'ngAnimate']);





//Configure states, we could also pull this out into it's own module
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('profile', {
    url: '/me', 
    templateUrl: '/some/template.html',
    controller: function($scope, user) {
      $scope.user = user;
      
    },
    resolve: {
      //Return a promise so that it can resolve and be injected into the controller
      user: function(ProfileService, $cookies) {
        return ProfileService.getUser($cookies.user.userId);
      }
    }
  })
  .state('profile.edit', {
    url: '/me/edit', 
    templateUrl: '/some/template.html',
    controller: function($scope, ProfileService, MessageService) {

      //expose save function for the view
      $scope.save = function() {
        ProfileService.save($scope.user, function(savedUser) {
          MessageService.info("Profile saved");
        })        
      }
    }
  })
}])





//environment variables
app.value('env', {
  version: '0.0.1', 
  name: 'cool app name', 
  apiVersion: 'v1', 
  apiUrl: 'api.app.com', 
  https: true
})




//ProfileService, handles everything for the logged in user
app.factory('ProfileService', ['$http', function($http) {
  var Profile = {

    //Return a promise
    getUser: function(id) {
      return $http.get('/api/v1/user/'+id);
    },

    save: function(user, cb) {
      $http.put('/api/v1/user/'+id)
      .success(function(user) {
        cb && cb(user);
      })
    }
  }

  return Profile
}])




//MessageService, handles alerts/notifications 
app.factory('MessageService', function() {
  
  var Message = {

    //array of messages
    messages: [],
    
    //TODO: Append messages to an array, have a directive display each message for 5 seconds
    info: function(message) {
      alert(message)
    }
  }

  return Message
})




//This will display the messages in the MessageService using ng-repeat in the template
app.directive('messages', ['MessageService', function(MessageService) {
  
  return {
    restrict: 'EA', 
    templateUrl: '/some/template.html', 
    link: function(scope, elm, attrs) {
      scope.messages = MessageService.messages;
      //TODO: implement logic for displaying each message for 3 seconds..
    }
  }

}])




//Lowercase filter
app.filter('lowercase', function() {
  return function(input) {
    return input.toLowerCase()
  }
})
