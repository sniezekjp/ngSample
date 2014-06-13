




//Init anuglar app, we'll be using ui.router in replace of ngRoute
var app = angular.module('APP', ['ui.router', 'ngCookies', 'ngSanitize', 'ngAnimate']);





//Configure states, we could also pull this out into it's own module, urls are optional
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
  
  //HTML5 mode? meaning do we want the hashtag in the url?
  var html5 = true;

  //check if browser supports html5 history
  if(window.history && window.history.pushState){
    $locationProvider.html5Mode(html5);
  }  


  //Configure different profile states, nested example
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
    url: '/edit', 
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




//configure run phase, Dependency injector is available, 
//as well as the $rootScope, typically we don't want to mess with 
//the rootScope
app.run(['$rootScope', 'SomeService', function($rootScope, SomeService) {
  
  //Event example
  $rootScope.$on('someEvent', 'data..')

  //$broadcast dispatches 'someEvent' to all child scopes
  $rootScope.$broadcast('someEvent', function(scope, data) {
    //data should equal 'data..'
  })

}])





//environment variables, we can also use app.constant if
//we want to prevent these values from being intercepted, 
//use app.value if you want to mock the ENV vars while testing
app.value('ENV', {
  version: '0.0.1', 
  name: 'cool app name', 
  apiVersion: 'v1', 
  apiUrl: 'api.app.com', 
  https: true
})




//ProfileService, handles everything for the logged in user
app.factory('ProfileService', ['$http', function($http) {
  
  var Profile = {

    //Get user by id
    getUser: function(id) {
      return $http.get('/api/v1/user/'+id);
    },

    //Save the user
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
      Message.messages.push(message)
      alert(message)
    }
  }

  return Message
})




//This will display the messages in the MessageService using ng-repeat in a template
app.directive('messages', ['MessageService', function(MessageService) {
  
  return {
    restrict: 'EA', 
    templateUrl: '/some/template.html', 
    link: function(scope, elm, attrs) {
      scope.messages = MessageService.messages;
      //TODO: implement logic for displaying each message for 5 seconds..
    }
  }

}])




//Example filter
//usage {{ user.name | lowercase }}
app.filter('lowercase', function() {
  return function(input) {
    return input.toLowerCase()
  }
})
