var app = {
  initialize: function () {
    this.bindEvents();
  },

  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function () {
  }
};

app.initialize();

angular.module('App', ['ngMaterial', 'ngRoute', 'firebase'])
    
  // .run(["$rootScope", "$location", function($rootScope, $location) {
  //     $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
  //       // We can catch the error thrown when the $requireAuth promise is rejected
  //       // and redirect the user back to the home page
  //       if (error === "AUTH_REQUIRED") {
  //           $location.path("/home");
  //       }
  //     });
  // }])
  //
  // .factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
  //   var ref = new Firebase("https://scorching-fire-8060.firebaseio.com");
  //   return $firebaseAuth(ref);
  // }])

  .controller('LoginController',
    function ($scope, $firebaseAuth) {
      var ref = new Firebase('https://scorching-fire-8060.firebaseio.com');
      var auth = $firebaseAuth(ref);
      $scope.user = {};

      $scope.login = function () {
        auth.$authWithPassword({
            email: $scope.user.email,
            password: $scope.user.password
          })
          .then(onLogon)
          .catch(onError);

        function onLogon(authData) {
          console.log("Authenticated payload:", authData);
          alert("Logou");
        }

        function onError(error) {
          console.log("Authentication error:", error);
          alert("Erro");
        }
      }
    })

  .controller('CreateUserController',
    function ($scope, $firebaseAuth) {
        var ref = new Firebase('https://scorching-fire-8060.firebaseio.com');
        var auth = $firebaseAuth(ref);
        $scope.user = {};

        if ($scope.user.password === $scope.user.passwordConfirmation) {

            $scope.createUser = function () {
                auth.$createUser({
                        email: $scope.user.email,
                        password: $scope.user.password
                    })
                    .then(onLogon)
                    .catch(onError);
            }

            function onLogon(authData) {
                console.log("Authenticated payload:", authData);
                alert("Criou");
            }

            function onError(error) {
                console.log("Authentication error:", error);
                alert("Errou");
            }
        }else {
            alert("Senha não confirmada");
        }
    })

  .controller('MainController', function ($scope, $timeout, $mdSidenav, $log, $firebaseArray, sharedObj) {
    var drugsRef = new Firebase('https://scorching-fire-8060.firebaseio.com/drugStores');
    var discountsRef = new Firebase('https://scorching-fire-8060.firebaseio.com/discounts');

    $scope.drugStores = $firebaseArray(drugsRef);
    $scope.discounts = $firebaseArray(discountsRef);

    $scope.go = function(drogstore) {
        sharedObj.setObj(drogstore);
    };

    $scope.toggleLeft = buildDelayedToggler('left');

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
  })

  .service('sharedObj', function () {
    var obj = {};

    var setObj = function(item) {
      obj = item;
    };

    var getObj = function() {
      return obj;
     };

    return {
      setObj: setObj,
      getObj: getObj
    }
  })


  .controller('DrugstoreController', function ($scope, $timeout, $mdSidenav, $log, $firebaseArray, sharedObj, $firebaseObject) {
    var drugs  = sharedObj.getObj().$id;
    var url = "https://scorching-fire-8060.firebaseio.com/";

    var drugsDesc = new Firebase(url);
    var drugsRef = new Firebase(url + "drugStores/" + drugs + "/products");
    var discountsRef = new Firebase(url + "discounts/" + drugs + "/products");

    $scope.data = {
        nameD: $firebaseObject(drugsDesc.child('drugStores').child(drugs).child('name')),
        notes: $firebaseObject(drugsDesc.child('drugStores').child(drugs).child('notes')),
        location: $firebaseObject(drugsDesc.child('drugStores').child(drugs).child('location')),
        review: $firebaseObject(drugsDesc.child('drugStores').child(drugs).child('reviews'))
    };


    $scope.products = $firebaseArray(drugsRef);
    $scope.discounts = $firebaseArray(discountsRef);

    $scope.toggleLeft = buildDelayedToggler('left');

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }
  })

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
        // resolve: {
        //     // controller will not be loaded until $requireAuth resolves
        //     // Auth refers to our $firebaseAuth wrapper in the example above
        //     "currentAuth": ["Auth", function(Auth) {
        //         // $requireAuth returns a promise so the resolve waits for it to complete
        //         // If the promise is rejected, it will throw a $stateChangeError (see above)
        //         return Auth.$requireAuth();
        //     }]
        // }
      }).
      
      when('/register', {
        templateUrl: 'views/registration.html',
        controller: 'CreateUserController'
      }).

      when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
        // resolve: {
        //     // controller will not be loaded until $waitForAuth resolves
        //     // Auth refers to our $firebaseAuth wrapper in the example above
        //     "currentAuth": ["Auth", function(Auth) {
        //         // $waitForAuth returns a promise so the resolve waits for it to complete
        //         return Auth.$waitForAuth();
        //     }]
        //}
      }).
      when('/drugstore', {
        templateUrl: 'views/drugstore.html',
        controller: 'DrugstoreController'
      }).
    when('/projetosdelei', {
        templateUrl: 'views/projetosdelei.html',
        controller: 'CreateUserController'
      }).
    when('/rodrigo', {
        templateUrl: 'views/rodrigo.html',
        controller: 'CreateUserController'
      }).
    when('/votacaonaale', {
        templateUrl: 'views/votacaonaale.html',
        controller: 'CreateUserController'
      }).
    when('/leinaale', {
        templateUrl: 'views/leinaale.html',
        controller: 'CreateUserController'
      }).

      otherwise({
        redirectTo: '/login'
      });
    }]);