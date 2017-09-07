
import './style.scss';
import './authentication/auth.module';
// import angular from 'angular';

const app = angular.module('MockReddit', [
                                            'ngMaterial', 
                                            'ngMessages', 
                                            'ngFileUpload',
                                            'ui.router', 
                                            'MockReddit.Auth'
                          ]);



require('./app.config')(app);

require('./controllers')(app);
require('./directives')(app);
require('./services')(app);


require('./filters/whenFilter')(app);

 