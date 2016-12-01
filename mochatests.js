/**
 * Test Cases for EbayJ app
 */
var assert = require('assert');
var http = require('http');
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");
var app = require('./app');

describe('AdvertisementsList',function(){
	describe('#getAdvertisementsList()',function(){
		it('should return the list of advertisements',function(done){
			server
			.get("/getAdvertisementsList4")
			.expect("Content-type",/json/)
			.expect(200) 
			.end(function(err,res){
			 console.log("================================================");
				console.log('---- ',res.text);
			  should.exist(res.text);
       done();
			});
		});
	});
});

describe('BidsList',function(){
	describe('#getBidsList()',function(){
		it('should return the list of all the bids',function(done){
			server
			.get("/bidsList2")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				res.status.should.equal(200);
				var text = JSON.parse(res.text.length);
				console.log('ccccccccccccc',text);
        text.should.equal(1060);
				done();			
			});
		});
	});
});

describe('BidsListObject',function(){
	describe('#getBidsList()',function(){
		it('should return the list of objects all the bids',function(done){
			server
			.get("/bidsList2")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				var body = JSON.parse(res.text);
        console.log('///////////////////////////'+ res.text);
        console.log('BBBBBBBBBBBBBBBB'+ body.res[0]._id);
        console.log('BBBBBBBBBBBBBBBB'+ body.res[0].name);
        console.log('BBBBBBBBBBBBBBBB'+ body.res[0].description);
        console.log('BBBBBBBBBBBBBBBB'+ body.res[0].seller);
        console.log('BBBBBBBBBBBBBBBB'+ body.res[0].bidder);
        body.res[0]._id.should.equal("581d44851871bb1bd36529cc");
        body.res[0].name.should.equal("Rolex Watch");
        body.res[0].description.should.equal("Vintage Classical Rolex Watch");
        body.res[0].seller.should.equal("Rolex Inc.");
        body.res[0].bidder.should.equal("w");
				done();
			});
		});
	});
});

describe('UserProfile',function(){
	describe('#getUserProfile()',function(){
		it('should return empty if the user is not logged in ',function(done){
			server
			.get("/getLoggedInUserProfile2")
			.expect("Content-type",/json/)
			.expect(200) 
			.end(function(err,res){
				res.status.should.equal(200);
				var text = JSON.parse(res.text);
				var str = JSON.stringify(text);
				str.should.equal('{}');
				done();			
			});
		});
	});
});

describe('Login', function(){
	var agent = supertest.agent(app);
	it('should login',function(done){
		supertest(app)
		.post('/login')
		.send({
			email: 'w',
			password: 'w'
		})
		.end(function (err, res) {
			if (err) {
			 return done(err);
			}
      console.log('Http Status Code should Be 200 - '+res.statusCode);
      res.statusCode.should.equal(200);
      // var text = JSON.parse(res);
      // console.log('RRRRRRRRRRRRRRRRRR'+text);
			// text.Status.should.equal('OK');
			done();
		});

	});	
});
