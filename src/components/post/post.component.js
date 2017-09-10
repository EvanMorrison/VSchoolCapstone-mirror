module.exports = (app) => {
  
    app.component('postComponent', {
      template: require('./post.template.html'),
      controller: [
                    '$state',
                    '$stateParams',
                    'PostService',
                    'UserService',
                    PostController  
      ],
      controllerAs: 'vm'

    }); 
      
    function PostController($state, $stateParams, PostService, UserService) {
        const vm = this;
        // test for user login to show or hide applicable features
        vm.isAuthenticated = UserService.isAuthenticated;
    
        // get all comments for the post with the id passed as a url parameter
            (function getPostComments () {
              console.log('get postcomments for post id ', $stateParams.id)
                PostService.getPostComments($stateParams.id)
                .then(function(response){
                    console.log('acquired post ', response)
                    vm.post = response;
                })
            })();
    
    
        // Save a new comment associated with an existing Postsend
        // Pass an object to PostService 
        // that contains the comment text and id of the parent Post as postID
            vm.submitComment = function(){
                PostService.addCommentToPost(vm.newComment, vm.post._id)
                .then(function(response){
                    console.log('adding comment ')
                    vm.post = response;
                    vm.newComment.content = ""
                })
            }
    
            vm.addPostVote = function(post, direction) {
    
                if (direction === "up") {
    
                    post.netVotes++;
                    post.upVotes++;
                }
                else {
    
                    post.netVotes--;
                    post.downVotes++;
                }

                // TODO: need to refactor to update the vote count without sedning the
                // whole post content back and forth between client and server
                PostService.updatePost(post);
            };
    
            vm.addCommentVote = function(comment, direction) {
    
                if (direction === 'up') {
    
                    comment.netVotes++;
                    comment.upVotes++;
                }
                else {
    
                    comment.netVotes--;
                    comment.downVotes++;
                }
                PostService.updateComment(comment);
            };
    
    }
  
}
  