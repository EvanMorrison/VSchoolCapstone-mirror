module.exports = (app) => {
  require('./navbar/navbar.Directive')(app);
  require('./sideBar/sideBar.Directive')(app);
}