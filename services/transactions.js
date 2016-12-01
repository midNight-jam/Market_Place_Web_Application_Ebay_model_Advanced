/**
 * Created by jayam on 11/1/16.
 */
var mongo = require('../db/myMongo.js');

module.exports.getUsersTransactions = function (msg, callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('transactions');
    console.log('msg received at ', msg);
    console.log('connected to mdb transactions');
    // coll.find({_id:msg.userId}).toArray(function (err, results) {
    coll.find({user:msg.userId.username}).toArray(function (err, results) {
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        console.log('GET TANSACITONS',results);
        console.log('ZZZ ' + JSON.stringify(res) + ' ZZZ');
        returnMongoConnection(mdb);
        callback(null, results);
      }
    });
  });
};