var ebayDB = "mongodb://localhost:27017/ebayj";

exports.getAdvertisementsList = function(req,res){
	var connection = mysql.getConnection();
	var query = 'select * from advertisements where quantity > 0';

	mysqlpooled.pushQuery(query,function(err,results){
		if(err){
			console.log(err);
			res.send({
				Status:'NOT OK'
			});
		}
		else{
			res.send(results);	
		}
	});
};

var mqClient = require('../rpc/client');

module.exports.getAdvertisementsList4 =function(req,res) {
  var msg_payload = {payload:{}, target: "getAllAdvertisements"};
  mqClient.make_request('advertisments_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }
    res.send({"res": results});
  });
};