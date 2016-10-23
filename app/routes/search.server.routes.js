var search = require('../controllers/search.server.controller');

module.exports = function(app){
   app.get('/', function(req, res){
      console.log('get /');
      res.send('HOME');
   });
   app.route('/search/:term').get(search.search);
   app.param('term', search.updateSearchHistory);
};
