var google = require('google-search');
var mongoConfig = require(process.cwd()+'/config/mongodb');

exports.getSearchHistory = function(req, res){
   console.log('getting search history');
   var mongoClient = require('mongodb').MongoClient;
   mongoClient.connect(mongoConfig.mlabGuest, function(err, db){
      if (err){
         res.send(err);
      } else {
         db.collection(mongoConfig.historyCollection, function(err, col){
            if (err){
               res.send(err);
               db.close();
            } else {
               col.find({}, {'_id': 0}, function(err, cursor){
                  if (err){
                     res.send(err);
                     db.close();
                  } else {
                     cursor.toArray(function(err, docs){
                        res.send(docs);
                     });
                     db.close();
                  }
               });
            }
         });
      }
   });
};

exports.getSearchTerm = function(req, res, next, term){
   req.searchterm = term;
   next();
};

exports.updateSearchHistory = function(req, res, next){
   console.log('updating search history');
   var mongoClient = require('mongodb').MongoClient;
   mongoClient.connect(mongoConfig.mlabAdmin, function(err, db){
      if (err){
         console.log('unable to connect to database');
      } else {
         db.collection(mongoConfig.historyCollection, function(err, col){
            if (err){
               console.log(err);
               db.close();
            } else {
               col.insert({'searchterm': req.searchterm, 'date': new Date(Date.now()).toString()}, function(err, doc){
                  if (err){
                     console.log(err);
                  } else {
                     console.log('updated search history');
                  }
                  db.close();
               });
            }
         });
      }
   });
   next();
};

exports.search = function(req, res, next){
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
        console.log('error******');
        console.log(JSON.stringify(err));
        res.send(err);
      }
      //console.log(JSON.stringify(response));
      res.send(response);
   });
};
