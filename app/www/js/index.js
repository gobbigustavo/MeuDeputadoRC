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

    .controller("SampleCtrl", function ($scope, $firebaseObject, $firebaseArray) {
        var ref = firebase.database().ref().child("votacaonaale");

        // Option 1
        var votacaonaale = $firebaseArray(ref);
        votacaonaale.$loaded()
            .then(function() {
                $scope.list = votacaonaale;
            })
            .catch(function(error) {
                console.log("Error:", error);
            });

        // Option 2
        var votacaonaale2 = $firebaseObject(ref);
        votacaonaale2.$bindTo($scope, "list2");
    })

    .service('sharedObj', function () {
        var obj = {};

        var setObj = function (item) {
            obj = item;
        };

        var getObj = function () {
            return obj;
        };

        return {
            setObj: setObj,
            getObj: getObj
        }
    })

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'SampleCtrl'
            // resolve: {
            //     // controller will not be loaded until $requireAuth resolves
            //     // Auth refers to our $firebaseAuth wrapper in the example above
            //     "currentAuth": ["Auth", function(Auth) {
            //         // $requireAuth returns a promise so the resolve waits for it to complete
            //         // If the promise is rejected, it will throw a $stateChangeError (see above)
            //         return Auth.$requireAuth();
            //     }]
            // }
        }).when('/register', {
            templateUrl: 'views/registration.html',
            controller: 'SampleCtrl'
        }).when('/home', {
            templateUrl: 'views/main.html',
            controller: 'SampleCtrl'
            // resolve: {
            //     // controller will not be loaded until $waitForAuth resolves
            //     // Auth refers to our $firebaseAuth wrapper in the example above
            //     "currentAuth": ["Auth", function(Auth) {
            //         // $waitForAuth returns a promise so the resolve waits for it to complete
            //         return Auth.$waitForAuth();
            //     }]
            //}
        }).when('/drugstore', {
            templateUrl: 'views/drugstore.html',
            controller: 'SampleCtrl'
        }).when('/projetosdelei', {
            templateUrl: 'views/projetosdelei.html',
            controller: 'SampleCtrl'
        }).when('/rodrigo', {
            templateUrl: 'views/rodrigo.html',
            controller: 'SampleCtrl'
        }).when('/votacaonaale', {
            templateUrl: 'views/votacaonaale.html',
            controller: 'SampleCtrl'
        }).when('/leinaale', {
            templateUrl: 'views/leinaale.html',
            controller: 'SampleCtrl'
        }).when('/boaspraticas', {
            templateUrl: 'views/boaspraticas.html',
            controller: 'SampleCtrl'
        }).when('/deputadonapraca', {
            templateUrl: 'views/deputadonapraca.html',
            controller: 'SampleCtrl'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);