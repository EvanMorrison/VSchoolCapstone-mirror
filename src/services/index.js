module.exports = (app) => {

  require('./post.Service')(app);
  require('./search.Service')(app);
  require('./subForum.Service')(app);

}