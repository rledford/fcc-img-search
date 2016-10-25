var google = require('google-search');

exports.getSearchHistory = function(req, res){
   console.log('getting search history');
   var mongoClient = require('mongodb').MongoClient;
   mongoClient.connect(process.env.MONGO_URI, function(err, db){
      if (err){
         res.send(err);
      } else {
         db.collection(process.env.HISTORY, function(err, col){
            if (err){
               res.send(err);
               db.close();
            } else {
               console.log('sorting resutls');
               col.find({}, {'_id': 0}).sort({'date': -1}).limit(10).toArray(function(err, docs){
                  console.log(docs);
                  res.send(docs);
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
   mongoClient.connect(process.env.MONGO_URI, function(err, db){
      if (err){
         console.log('unable to connect to database');
      } else {
         db.collection(process.env.HISTORY, function(err, col){
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
   var gsearch = new google({key: process.env.GOOGLE_KEY , cx: process.env.GOOGLE_CX});
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
      //console.log(JSON.stringify(response));
      res.send(response);
   });
};
