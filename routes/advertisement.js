/////work on this method///

var mqClient = require('../rpc/client');

module.exports.updateBid2 = function(req,res){
  var updateBid ={};
  updateBid.id= req.param("id");
  updateBid.name = req.param("name");
  updateBid.description = req.param("description");
  updateBid.seller= req.param("seller");
  updateBid.bidamount = req.param("bidamount");
  updateBid.quantity = req.param("quantity");
  updateBid.bidder= req.user.username;
  updateBid.enddate = req.param("enddate");

	var msg_payload = {
		payload: {
      id: updateBid.id,
      bidamount: updateBid.bidamount,
			bidder:updateBid.bidder
    },
		target: 'updateBid'
	};
	mqClient.make_request('bids_queue', msg_payload, function (err, results) {
		console.log('Client received results ' + JSON.stringify(results));
		if (err) {
			res.send({"err": err});
		}
		res.send({"res": results});
	});

};

module.exports.submitAdvertisement2 = function(req,res) {
  var isBid = req.param("isBid");

  var newAdvertisement = {
    name: req.param("itemname"),
    description: req.param("itemdescription"),
    seller: req.param("sellerinformation"),
    price: req.param("itemprice"),
    quantity: req.param("itemquantity")
  };

  if (isBid) {
    newAdvertisement.enddate = req.param("enddate");
    newAdvertisement.bidder = '';
    newAdvertisement.bidamount = 0;
    var msg_payload = {
      payload: newAdvertisement,
      target: 'newBid'
    };
    mqClient.make_request('bids_queue', msg_payload, function (err, results) {
      console.log('Client received results ' + JSON.stringify(results));
      if (err) {
				res.send({"err": err});
      }
      res.send({"res": results});
    });

  }
  else {
    var msg_payload = {
      payload: newAdvertisement,
      target: 'newAdvertisement'
    };
    mqClient.make_request('advertisments_queue', msg_payload, function (err, results) {
      console.log('Client received results ' + JSON.stringify(results));
      if (err) {
				res.send({"err": err});
      }
      res.send({"res": results});
    });
  }
};