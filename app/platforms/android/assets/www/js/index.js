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
    
    .controller("SampleCtrl", function ($scope, $firebaseObject, $firebaseArray, $mdDialog) {
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

        // Compute votes yes
        $scope.computeVotesYes = function(index) {
            $scope.list[index].sim += 1;
            $scope.list.$save(index);
        };

        // Compute votes no
        $scope.computeVotesNo = function(index) {
            $scope.list[index].nao += 1;
            $scope.list.$save(index);
        };
    
        $scope.showAlert = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Seu voto foi computado com sucesso!')
                .textContent('Obrigado por dar seu voto e contribuir com a democracia em Alagoas!')
                .ariaLabel('Popup de Confirmação')
                .ok('Ok')
                .targetEvent(ev)
            );
          };
 
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
        }).when('/deputadoporumdia', {
            templateUrl: 'views/deputadoporumdia.html',
            controller: 'SampleCtrl'
         }).when('/revogai', {
            templateUrl: 'views/revogai.html',
            controller: 'SampleCtrl'
        }).when('/politicadeverdade', {
            templateUrl: 'views/politicadeverdade.html',
            controller: 'SampleCtrl'
            }).when('/selecaopublica', {
            templateUrl: 'views/selecaopublica.html',
            controller: 'SampleCtrl'
        }).when('/suacidade', {
            templateUrl: 'views/suacidade.html',
            controller: 'SampleCtrl'    
        }).otherwise({
            redirectTo: '/home'
        });
    }]);