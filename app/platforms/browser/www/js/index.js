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
   
    .controller("SampleCtrl", function ($scope, $window, $cookies, $http, $firebaseObject, $firebaseArray, $mdDialog) {

        $scope.$on('$routeChangeSuccess', function () {
            var url = window.location.href
            var login = url.split("/").pop()

            if (localStorage.getItem("currentUser") != null && login == "login") {
                $window.location.href = '#/home';
                console.log(firebase.auth().currentUser)
                console.log("entrou no if")
            }
        });

        $scope.x = true;      
        $scope.flag = false; 
            
        $scope.start = function () {
            $cookies.remove(active);
        };
//376193ce-a168-4e13-9dac-19078e7b04d5
//91500bbf-6a71-433d-84b8-f135c305671f
        
        $scope.createuser = function () {
            var email = document.getElementById('emailregister').value;
            var password = document.getElementById('passwordregister').value;
          
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(firebaseUser) {
                    swal("Cadastrado!", "Usuário cadastrado com sucesso!", "success");
                    setTimeout(function () {
                        $window.location.href = '#/login';
                    }, 2000);
                })
                .catch(function(error) {
                    swal("Erro!", "A senha deve ter no mínimo 6 caracteres!", "error");
                });
        }

        $scope.login = function () {
            if (localStorage.getItem("currentUser") != null) {
                $window.location.href = '#/home';
            } else {
                var email = $scope.email;
                var password = $scope.password;
              
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function(firebaseUser) {
                       $window.location.href = '#/home';
                       localStorage.setItem("currentUser", firebase.auth().currentUser);
                       console.log(firebase.auth().currentUser);
                    })
                    .catch(function(error) {
                       var errorCode = error.code;
                       var errorMessage = error.message;
                       if (errorCode === 'auth/wrong-password') {
                           alert('Wrong password.');
                       } else {
                           alert(errorMessage);
                       }
                       console.log(error);
                });
            }
        }

        $scope.sendEmail2 = function() {

            Email.send(
                "contatonossodeputado@gmail.com",
                "mandato@rodrigocunha.org",
                "Reposta do formulário: Fale com o Rodrigo",
                "Nome: " + document.getElementById("nome").value + "<br>" +
                "E-mail: " + document.getElementById("email").value + "<br>" +
                "Telefone: " + document.getElementById("telefone").value + "<br>" +
                "Mensagem: " + document.getElementById("mensagem").value,
                {token: "376193ce-a168-4e13-9dac-19078e7b04d5"});

            setTimeout(function () {
                swal("Enviado!", "Sua mensagem para o Rodrigo foi enviada com sucesso!", "success");
            }, 1000);

            setTimeout(function () {
                $window.location.href = '#/home';
            }, 2000);
        };
        
        $scope.onSwipeRight = function(ev) {
            console.log("right");
        };
         
        $scope.onSwipeLeft = function(ev) {
            console.log("left");
        };
    
        $scope.onTabChanges = function (currentTabIndex) {
            sessionStorage.setItem('active', currentTabIndex);
        };
    
        if (sessionStorage.getItem('active') === undefined) {
            $scope.selectedIndex = 0;
        } else {
            $scope.selectedIndex = sessionStorage.getItem('active');
        }
    
        $scope.init = function () {
            firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        $scope.uid = user.uid;
                    }
                });
            updatelist();
        }    

        $scope.flag = true;

        // Option 1
        function updatelist() {
            var ref1 = firebase.database().ref().child("votacaonaale");  
            var votacaonaale = $firebaseArray(ref1);
            votacaonaale.$loaded()
            .then(function () {
                $scope.list = votacaonaale;
                $scope.tamanho = $scope.list.length+1;

                $scope.hide = function (user){
                    var b;
                    if(user != null){
                        for (var i = 0; i < Object.keys(user).length; i++) {
                            if(Object.keys(user)[i] == $scope.uid){
                                b = i;
                            }
                        }
                    }
                    if(b != null){
                        var a = Object.keys(user)[b];
                    } 
                    if(a == $scope.uid){
                        $scope.tamanho--;
                    }
                    if($scope.tamanho <= 0){
                        $scope.flag = false;
                    }   
                    return  a != $scope.uid;    
                }               
            })
            .catch(function (error) {
                console.log("Error:", error);
            });
        } 
    
        var ref = firebase.database().ref().child("votacaonaale");  
     
        // Option 2
        var votacaonaale2 = $firebaseObject(ref);
        votacaonaale2.$bindTo($scope, "list2");
        
        // Compute votes yes
        $scope.computeVotesYes = function (index) {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                var json = user.uid;
                var lei = parseInt(index) + 1; 
                firebase.database().ref().child("votacaonaale").child("lei" + lei).child("users").child(user.uid).set(json);
                
                updatelist();
              }
            });
            
            $scope.list[index].sim += 1;
            $scope.list.$save(index);
            $scope.isDisabled = true;
        };

        // Compute votes no
        $scope.computeVotesNo = function (index) {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                var json = user.uid;
                var lei = parseInt(index) + 1; 
                firebase.database().ref().child("votacaonaale").child("lei" + lei).child("users").child(user.uid).set(json);
              
                updatelist();
              }
            });
            
            $scope.list[index].nao += 1;
            $scope.list.$save(index);
            $scope.isDisabled = true;
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
            //         $window.location = '/login';
            //         return Auth.$waitForAuth();
            //     }]
            // }
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
            redirectTo: '/login'
        });
    }]);