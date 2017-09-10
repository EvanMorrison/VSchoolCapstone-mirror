
import './style.scss';
// import './authentication/auth.module';


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

 