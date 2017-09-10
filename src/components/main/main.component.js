module.exports = (app) => {
  
  
    app.component('mainComponent', {
      template: require('./main.template.html'),
      controller: ['PostService', MainController ],
      controllerAs: 'vm'
      
    });
      
      function MainController(PostService) {    
        const vm = this;

          function getPosts() {
              PostService.getPosts()
                  .then(function (response) {
                      vm.posts = response;
                      vm.posts.sort((a,b) => b.netVotes - a.netVotes);
                      console.log(vm.posts);
                  });
          }
          getPosts();
  
  
  
          vm.addPostVote = function(post, direction) {
  
              if (direction === "up") {
  
                  post.netVotes++;
                  post.upVotes++;
              }
              else {
  
                  post.netVotes--;
                  post.downVotes++;
              }
              PostService.updatePost(post);
              vm.posts.sort((a,b) => b.netVotes - a.netVotes);
          };
        }
        
  }
  