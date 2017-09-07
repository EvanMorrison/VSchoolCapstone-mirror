/* capstone server.js */

// Require packages
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var expressJwt = require("express-jwt");
var path = require("path");
var mongoose = require("mongoose");

// Config environment variables
var config = require("./backend/config");
var port = process.env.PORT || 7000;


// Create Server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger("dev"));

// Connect to Mongoose
var database = path.join(config.db_host,config.db_name);
mongoose.connect("mongodb://" + config.db_user + ":" + config.db_pass + "@" + database, function(err) {
    if (err) console.log("Error connecting to MongoDB: ", err.message);
    else console.log("Connected to MongoDB " + database);
});

// use webpack dev-server middleware for development
if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHMR = require('webpack-hot-middleware');
    const historyApiFallback = require('connect-history-api-fallback');
  
    const config = require('./webpack.config.js');
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



     // serve index.html for all requests without a route specified above
    // app.get('*', function(req, res) {
    //   res.sendFile(path.join(__dirname,'/dist/index.html'))
    // });
}


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


app.listen(port, function() {console.log("Server is listening on port", port)});


