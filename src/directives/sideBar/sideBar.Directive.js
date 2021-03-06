module.exports = (app) => { 
        
    app.directive('sideBar', function () {
        return {
            restrict: 'E',
            template: require('./sideBar.html'),
            controller: ['$rootScope', '$scope', '$mdDialog', '$timeout', '$location', 'UserService', 'SearchService', 'PostService', function ($rootScope, $scope, $mdDialog, $timeout, $location, UserService, SearchService, PostService) {

                $rootScope.$on('authenticate', function () {
                    $scope.permission = UserService.isAuthenticated()
                });


                $scope.permission = UserService.isAuthenticated();
                $scope.showAuthForm = function ($event) {
                    $mdDialog.show({
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        template: require('../../templates/loginAndSignUp.html'),
                        scope: $scope,
                        preserveScope: true
                    })
                };
                $scope.location = $location;

                $scope.close = function () {
                    $mdDialog.hide();
                };


                $scope.signup = function (user) {
                    $scope.duplicate = false;
                    console.log('new user ', user);
                    UserService.signup(user)
                        .then(function (response) {
                            if (response.success === false && response.cause === 'username or email') {
                                $scope.message = response.message;
                                $scope.duplicate = true;
                                $timeout(function () {
                                    $scope.duplicate = false
                                }, 3000)

                            } else {
                                $scope.success = true;
                                UserService.newSignup = response.user;
                                $mdDialog.hide();
                            }
                        })
                }

                $scope.querySubs = function () {
                    $location.path('/search/' + $scope.search.query);
                };

                $scope.addPostVote = function (post, direction) {

                    if (direction === "up") {

                        post.netVotes++;
                        post.upVotes++;
                    }
                    else {

                        post.netVotes--;
                        post.downVotes++;
                    }
                    PostService.updatePost(post);
                };
            }]
        }
    });

}