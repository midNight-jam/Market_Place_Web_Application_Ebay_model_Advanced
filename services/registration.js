/**
 * Created by jayam on 10/31/16.
 */
var mongo = require('../db/myMongo.js');

module.exports.registerNewUser = function (msg, callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('users');
    console.log('msg received at ', msg);
    console.log('connected to mdb advertisements');
    coll.insertOne(msg, function (err, results) {
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        console.log(results);
        res = results;
        console.log('ZZZ ' + JSON.stringify(res) + ' ZZZ');
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};