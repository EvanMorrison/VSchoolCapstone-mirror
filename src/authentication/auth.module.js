

    
    const app = angular.module('MockReddit.Auth', [
                                                    'ui.router', 
                                                    'ngAnimate',
                                                    'ngCookies'
                                                ]);

        require('./controllers/logout')(app);
        require('./controllers/profile')(app);


    // only the Logout has a route with a view because signup and login are handled in pop-up modals
    app.config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state('/auth/profile', {
                template: require('./templates/profile.html'),
                controller: 'ProfileController'
            })
    }])

    // Controller for the login/signup sidebar
    app.controller('AuthController', ["$scope", "UserService", function ($scope, UserService) {
        $scope.logoImg = require('../assets/logo.png');
        

        $scope.userService = UserService;
        $scope.permission = UserService.isAuthenticated();
        $scope.userService.user = UserService.user || UserService.getUserFromToken();
        $scope.$on('authenticate', function () {
            $scope.permission = UserService.isAuthenticated();
            if (UserService.isAuthenticated() && !UserService.user) {
                $scope.UserService.getUserFromToken();
            }
        });
        

    }]);



    // Set, Get and Remove Token for user authentication
    app.service('TokenService', ['$cookies', function ($cookies) {
        var userToken = 'token';
       // store the token in a cookie
       this.setToken = function(token) {
            $cookies.put(userToken, token);
       }

       this.getToken = function() {
           return $cookies.get('token');
       }

       this.removeToken = function() {
           $cookies.remove('token');
       }
       
    }]);

    // Service to handle user signup, login, and logout
    app.service('UserService', ["$rootScope", "$http", "$location", "TokenService", function ($rootScope, $http, $location, TokenService) {
        var self = this;
        self.user = null;

        /**
         * Broadcast event to scopes that are listening
         * for it. Updates authentication status.
         */
        function updateAuthentication() {
            $rootScope.$broadcast('authenticate');
        }

    ///////////////////////////////////////
    ///             OAUTH               ///
    ///////////////////////////////////////

        // FACEBOOK - due to CORS issues sign up/sign in is handled directly on the server and
        // the auth token is saved using cookie storage.
        // need function to retrieve the user info from the server using the cookie/token
        this.facebook = function () {
            
        }

        // GOOGLE - due to CORS issues sign up/sign in is handled directly on the server and
        // the auth token is saved using cookie storage.
        // need function to retrieve the user info from the server using the cookie/token
        this.google = function () {

        }


        // signup with local auth
        this.signup = function (userObj) {
            return $http.post('/auth/signup', userObj)
                .then(function (response) {
                    return (response.data);
                }, function (error) {
                    console.log('UserService signup error ', error);
                });
        }

        this.login = function (userObj) {
            return $http.post('/auth/login', userObj)
                .then(function (response) {
                    TokenService.setToken(response.data.token);
                    self.user = response.data.user;
                    self.user.name = self.user.firstName || self.user.username;
                    updateAuthentication();
                    return (response)
                }, function (error) {
                    console.log('UserService login error ', error);
                    return error;
                })
        }

        this.logout = function () {
            TokenService.removeToken();
            $location.path('/');
            updateAuthentication();
        };

        this.isAuthenticated = function () {
            return !!TokenService.getToken();
        };

        this.getUserFromToken = function () {
            
            if (self.user) {
                return self.user
            } else if (self.isAuthenticated()) {
                return $http.post('/auth/verifyuser', {
                        token: TokenService.getToken()
                    })
                    .then(function (response) {
                        self.user = response.data;
                        self.user.name = self.user.firstName || self.user.username;
                        return response.data
                    }, function (error) {
                        console.log('Error verifying loggedin user: ', error)
                        $location.path('/');
                    })
            } else {
                return 'user not logged in';
            }
        }

    }]);

    // interceptor to add the user authentication token to all CRUD methods
    app.factory("AuthInterceptor", ["$q", "$location", "TokenService", function ($q, $location, TokenService) {
        return {
            request: function (config) {
                var token = TokenService.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = "Bearer " + token;
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401) {
                    TokenService.removeToken();
                    $location.path('/');
                }
                return $q.reject(response);
            }

        }
    }]);

    // add the AuthInterceptor to the httpProvider settings. 
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);

