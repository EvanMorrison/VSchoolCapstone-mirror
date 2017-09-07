module.exports = (app) => {

  require('./main.Controller')(app);
  require('./newPost.Controller')(app);
  require('./newSubForum.Controller')(app);
  require('./post.Controller')(app);
  require('./search.Controller')(app);
  require('./sub.Controller')(app);
  
}