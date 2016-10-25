var express = require('express');

module.exports = function(){
   var app = express();

   //the views path is relative to where the APP working directory
   //in this case it's the image-search directory
   //IT IS NOT RELATIVE TO WHERE "THIS" FILE IS...
   app.set('views', './app/views');
   app.set('view engine', 'ejs');
   app.set('port', process.env.PORT || process.env.LOCAL_PORT);
   //apply search routes
   require('../app/routes/search.server.routes')(app);

   return app;
};
