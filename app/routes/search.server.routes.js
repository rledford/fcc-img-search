var search = require('../controllers/search.server.controller');

module.exports = function(app){
   app.get('/', search.getSearchHistory);
   app.route('/search/:term').get(search.updateSearchHistory, search.search);
   app.param('term', search.getSearchTerm);
};
