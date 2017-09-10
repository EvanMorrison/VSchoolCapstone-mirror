
module.exports = (app) => {

    

    app.config([
                    '$locationProvider',
                    '$stateProvider',
                    '$urlRouterProvider',
                    '$mdThemingProvider', 
                    function (
                        $locationProvider, 
                        $stateProvider, 
                        $urlRouterProvider, 
                        $mdThemingProvider) {
                        
                        
                        $locationProvider.html5Mode(true);

                        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                template: require('./templates/main.html'),
                controller: 'MainController'
            })
            .state( 'newpost', {
                url: '/newpost', 
                template: require('./templates/createPost.html'),
                controller: 'NewPostController'
            })
            .state( 'messages', {
                url: '/messages', 
                template: require('./templates/messages.html')
            })
            .state( 'newsubforum', {
                url: '/newsubforum', 
                template: require('./templates/createSubForum.html'),
                controller: 'NewSubForumController'
            })
            .state( 'post', {
                url: 'post/:id', 
                template: require('./templates/singlePost.html'),
                controller: 'PostController'
            })
            .state( 'search', {
                url: '/search/:keyword', 
                template: require('./templates/results.html'),
                controller: 'SearchController'
            })
            .state( 'sub', {
                url: '/sub/:id', 
                template: require('./templates/subForumMain.html'),
                controller: 'SubController'
            })
            .state('profile', {
                url: '/userprofile',
                template: require('./authentication/templates/profile.html'),
                controller: 'AuthController'
            })
            


        $mdThemingProvider.theme('default')
            .primaryPalette('orange');

        $mdThemingProvider.theme('forms')
            .primaryPalette('blue-grey', {
                'default': '600'
            })
            .accentPalette('blue-grey', {
                'default': '500'
            });

        $mdThemingProvider.theme('cyan')
            .primaryPalette('cyan', {
                    'default': '600',
                    'hue-1': '100',
                    'hue-2': '600',
                    'hue-3': 'A100'
                }
            )
            .accentPalette('grey', {
                'default': '300',
                'hue-1': '500',
                'hue-2': '700',
                'hue-3': 'A100'
            })
            .backgroundPalette('blue-grey', {
                'default': '500',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
            }).dark();

        $mdThemingProvider.theme('blue')
            .primaryPalette('blue-grey')
            .accentPalette('grey', {
                'default': '400'
            });

    }]);

}