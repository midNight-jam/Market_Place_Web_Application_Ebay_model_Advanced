var mqClient = require('../rpc/client');

module.exports.getWonBidsList2 = function(req,res) {
  var msg_payload = {payload: {
    name:req.user.username
  }, target: "getUserWonBids"};
  mqClient.make_request('bids_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
      res.send({"err": err});
    }
    res.send({"res": results});
  });
};

module.exports.getBidsList2 = function(req,res) {
  var msg_payload = {payload: {}, target: "getAllBids"};
  mqClient.make_request('bids_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
      res.send({"err": err});
    }
    res.send({"res": results});
  });
};