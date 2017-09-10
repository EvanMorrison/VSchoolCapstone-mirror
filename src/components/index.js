module.exports = function(app) {
  require('./main/main.component')(app);
  require('./post/post.component')(app);
}