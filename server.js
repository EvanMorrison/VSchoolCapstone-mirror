/* capstone server.js */

// Require packages
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const expressJwt = require("express-jwt");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
// Config environment variables
const config = require("./backend/config");
const port = process.env.PORT || 8080;

// Connect to Mongoose
mongoose.Promise = global.Promise;
var database = path.join(config.db_host,config.db_name);
var mongoUrl = "mongodb://" + config.db_user + ":" + config.db_pass + "@" + database
mongoose.connect(mongoUrl, {
                              useMongoClient: true, 
                              reconnectTries: 30,
                            })
  .then(function(result) {
      console.log("Connected to MongoDB " + database);
})
.catch(function(err) {
  
      console.log("Error connecting to MongoDB: ", err.message);
  
});

mongoose.connection.on('disconnected', function () {
  mongoose.connect(mongoUrl)
})

// Create Server
const app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger("dev"));
// app.use(methodOverride());
app.use(cookieParser());

require('./backend/passport/passport')(app);






// Routes requiring authentication
app.use("/api", expressJwt({secret:config.db_secret}));
// require('./passport/passport')(app);
app.use("/api/user", require("./backend/routes/userRouteProtected"));
app.use("/api/admin", require("./backend/routes/adminRoute"));
app.use("/api/post", require("./backend/routes/postRouteProtected"));
app.use("/api/subreddit", require("./backend/routes/subredditRouteProtected"));
app.use("/api/comment", require("./backend/routes/commentRouteProtected"));

// Routes without authentication
app.use("/post", require("./backend/routes/postRoute"));
app.use("/subreddit", require("./backend/routes/subredditRoute"));
app.use("/comment", require("./backend/routes/commentRoute"));
// require('./backend/routes/authRoute')(app, passport);
app.use("/auth", require("./backend/routes/authRoute"));


// use webpack dev-server middleware for development
if (process.env.NODE_ENV !== 'production') {
  console.log('process.env ', process.env.NODE_ENV);
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHMR = require('webpack-hot-middleware');
  const historyApiFallback = require('connect-history-api-fallback');

  const config = require('./webpack.config.js')();
  const compiler = webpack(config);
  const instance = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  });
  app.use(instance);
  app.use(historyApiFallback());
  app.use(instance);
  app.use(webpackHMR(compiler, {
    reload: true
  }));
} else {
  app.use(express.static(path.join(__dirname,'/dist')));
}


app.listen(port, function() {console.log("Server is listening on port", port)});


