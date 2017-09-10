
module.exports = (app) => {
        
    app.directive('navbar', [function () {
        return {
            restrict: 'E',
            template: require('./navbar.html'),
            controller: 'AuthController'
        }
    }]);
    
}