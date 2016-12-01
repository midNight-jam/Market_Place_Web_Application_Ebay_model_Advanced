var crypto = require('crypto');
var key = 'abcdefg';

var incorrectDetails = function(req){
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = req.param("password");
	var email = req.param("email");

	var incorrect = (firstname === '' || firstname === null ||  firstname === undefined)
	|| (lastname === '' || lastname === null ||  lastname === undefined)
	|| (password === '' || password === null ||  password === undefined)
	|| (email === '' || email === null ||  email === undefined);
	return incorrect;
}

var isAlreadyRegistered = function(email){
	var connection = mysql.getConnection();
	var query = 'select * from users where email = '+connection.escape(email);
	mysqlpooled.pushQuery(query,function(err,results){
		if(err){
			return true;
		}
		else{
			if(results.length>0){
				return true;
			}
		}
		return false;
	});
}

exports.registerNewUser = function(req,res){

	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = req.param("password");
	var email = req.param("email");
	if(incorrectDetails(req)){
		res.send({
			Status:'Failed',
			Message:'Incorrect User Registeration Details'
		});
		return;
	}

	if(isAlreadyRegistered(email)){		
		res.send({
			Status:'Failed',
			Message:'User Already Registered'
		});
		return;
	}
	var encryptedPassword = crypto.createHmac('sha1', key).update(req.param("password")).digest('hex');
	var newUser = {
			firstname : req.param("firstname"),
			lastname : req.param("lastname"),
			password : encryptedPassword,
			email : req.param("email"),
			birthday:req.param("birthday"),
			location:req.param("location"),
			cellphone:req.param("contactno"),
			ebayhandle:req.param("ebayhandle")
	};

	var connection = mysql.getConnection();
	var query = 'INSERT INTO users SET ?';
	mysqlpooled.pushQuery('INSERT INTO users SET ?',function(err,result){
		if(err){
			res.send({
				Status:'Failed',
				Message:'User Registeration Failed'
			});
		}

		res.send({
			Status:'OK',
			Message:'User Registered'
		});
	},newUser);
};


var mqClient = require('../rpc/client');

module.exports.registerNewUser2 = function(req,res){
  console.log('at new regsitration');
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var password = req.param("password");
	var email = req.param("email");
	if(incorrectDetails(req)){
		res.send({
			Status:'Failed',
			Message:'Incorrect User Registeration Details'
		});
		return;
	}

	var encryptedPassword = crypto.createHmac('sha1', key).update(req.param("password")).digest('hex');
	var newUser = {
		firstname : req.param("firstname"),
		lastname : req.param("lastname"),
		password : encryptedPassword,
		email : req.param("email"),
		birthday:req.param("birthday"),
		location:req.param("location"),
		cellno:req.param("cellno"),
		ebayhandle:req.param("ebayhandle")
	};
  var msg_payload = {
  	payload:newUser,
    target:'registerNewUser'
	};
  mqClient.make_request('registration_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
      throw (err);
    }
    res.send({"res": results});
  });

};