
module.exports = (app) => {
    app.service('SearchService', ['$http', function ($http) {

        this.searchForSub = function (query) {
        return  $http.get('/subreddit/query/' + query)
                .then(function (response) {
                    return response.data;
                })
        }
    }]);

}