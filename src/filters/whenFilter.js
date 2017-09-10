import moment from 'moment';

module.exports = (app) => {

    
    app
    
    .filter('when', [function () {
        return function(time) {
            const now = moment();
            const then = moment(time);
            return then.from(now);
        }
    }])
    
    
}


