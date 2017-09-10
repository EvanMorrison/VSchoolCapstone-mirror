module.exports = (app) => {

  require('./newPost.Controller')(app);
  require('./newSubForum.Controller')(app);
  require('./search.Controller')(app);
  require('./sub.Controller')(app);
  
}