var google = require('google-search');

exports.search = function(req, res){
   var gsearch = new google({key: 'AIzaSyC856wLAVTWiJxcRIlaFG9Cps63Yl8PH7o', cx: '014136419315170420662:vdfddiykv3s'});
   gsearch.build({
      q: req.searchterm,
      start: (req.query.offset && parseInt(req.query.offset)) ? req.query.offset : 1,//THIS CANNOT BE 0 (ZERO) MUST BE BETWEEN ! and 101
      num: 10,
      searchType: 'image'
      //gl: 'us'
      //lr: 'lang_en'
   }, function(err, response){
      if (err){
        console.log(JSON.stringify(err));
        res.send(err);
      }
      console.log(JSON.stringify(response));
      res.send(response);
   });
};

exports.updateSearchHistory = function(req, res, next, term){
   console.log('updating search history');
   req.searchterm = term;
   next();
};
