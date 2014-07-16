
'use strict';

exports.init = function(req, res, next){
  var sigma = {};
  var collections = ['User', 'Account', 'Game'];
  var queries = [];

  collections.forEach(function(el, i, arr) {
    queries.push(function(done) {
      req.app.db.models[el].count({}, function(err, count) {
        if (err) {
          return done(err, null);
        }

        sigma['count'+ el] = count;
        done(null, el);
      });
    });
  });

  var asyncFinally = function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('index', sigma);
  };

  require('async').parallel(queries, asyncFinally);
};