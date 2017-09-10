

module.exports = (app) => {

    app
    .controller('LogoutController', ["$scope", "UserService", "TokenService", function($scope, UserService, TokenService) {
        $scope.user = UserService.user;
        UserService.user = {};
        TokenService.removeToken();

    }])

}
