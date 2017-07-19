var app = {
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        StatusBar.overlaysWebView(false);
    }
};

app.initialize();

angular.module('App', ['ngMaterial', 'ngRoute', 'firebase', 'ngCookies'])

    .controller("SampleCtrl", function ($scope, $cookies, $firebaseObject, $firebaseArray, $mdDialog) {

        $scope.onTabChanges = function (currentTabIndex) {
            console.log('Current tab ' + currentTabIndex);
            localStorage.setItem('active', currentTabIndex);
            console.log(localStorage.getItem('active'));
        };

        if (localStorage.getItem('active') === undefined) {
            $scope.selectedIndex = 0;
        }
        else {
            $scope.selectedIndex = localStorage.getItem('active');
        }

        var ref = firebase.database().ref().child("votacaonaale");

        // Option 1
        var votacaonaale = $firebaseArray(ref);
        votacaonaale.$loaded()
            .then(function () {
                $scope.list = votacaonaale;
            })
            .catch(function (error) {
                console.log("Error:", error);
            });

        // Option 2
        var votacaonaale2 = $firebaseObject(ref);
        votacaonaale2.$bindTo($scope, "list2");

        // Compute votes yes
        $scope.computeVotesYes = function (index) {
            $scope.list[index].sim += 1;
            $scope.list.$save(index);
        };

        // Compute votes no
        $scope.computeVotesNo = function (index) {
            $scope.list[index].nao += 1;
            $scope.list.$save(index);
        };

        // Compute parcial
        $scope.computeParcial = function (index) {
            $scope.list[index].parcialSim = (($scope.list[index].sim * 100) / ($scope.list[index].sim + $scope.list[index].nao)).toFixed(2);
            $scope.list[index].parcialNao = (($scope.list[index].nao * 100) / ($scope.list[index].sim + $scope.list[index].nao)).toFixed(2);
            $scope.list.$save(index);
            $scope.leiSelecionada = $scope.list[index];
        };

        $scope.showPrerenderedDialog = function (ev) {
            $mdDialog.show({
                contentElement: '#myDialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'SampleCtrl'
            });
        };

        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show({
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                template: '<md-dialog>' +
                '  <md-dialog-content>' +
                '<h2 style="margin-top: 30px; margin-left: 30px; margin-right: 30px; text-align: center;">Obrigado pelo seu voto!<h2>' +
                '<h4 style="margin-top: 5px; margin-left: 30px; margin-right: 30px; text-align: center;">Votação parcial:<h4>' +
                '<img src="img/sim.png" alt="Sim" height="20%" width="20%" style="margin-left: 25%; margin-right: 10%;"> <img src="img/nao.png" alt="Nao" height="20%" width="20%">' +
                '  </md-dialog-content>' +
                '<div style="display: inline-block; width: 20%; margin-left: 29%; margin-right: 5%;">{{ leiSelecionada.parcialSim }}%</div><div style="display: inline-block; width: 20%; margin-left: 8%; margin-right: 15%;">{{ leiSelecionada.parcialNao }}%</div>' +
                '</md-dialog>',
                locals: {dataToPass: $scope.leiSelecionada},
                controller: function ($scope, $mdDialog, dataToPass) {
                    $scope.leiSelecionada = dataToPass;
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }
            });

            function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
            }
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
        }).when('/falecomrodrigo', {
            templateUrl: 'views/falecomrodrigo.html',
            controller: 'SampleCtrl'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);