/*
* created by Jayam
* please pay attention to the sequence of creation
* */

var express = require('express')
, path = require('path')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, passport = require('passport')
, routes = require('./routes/index')
, mongoSessionURL = "mongodb://localhost:27017/ebayj"
, expressSession = require('express-session')
, MongoStore = require('connect-mongo')(expressSession)
, http = require('http')
, login = require('./routes/login')
, registration = require('./routes/registration')
, advertisement = require('./routes/advertisement')
, advertisementsList = require('./routes/advertisementsList')
, shopcart = require('./routes/shopcart')
, transactions = require('./routes/transactions')
,  passportauthhelper = require('./routes/passportauthhelper')
, logger = require('./routes/logger')
, loggerRoute = require('./routes/loggerRoute')
, bidsList  = require('./routes/bidslist')

require('./routes/auth')(passport);

var app = express();

app.use(expressSession({
  secret: 'abcde',
  resave: false,
  saveUninitialized: false,
  duration:30*60*1000,
  activeDuration : 5*60*1000,
  store: new MongoStore({
    url: mongoSessionURL
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());


//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/login',passportauthhelper.login);
app.post('/logger',express.bodyParser(),loggerRoute.write);
app.get('/getAdvertisementsList4',advertisementsList.getAdvertisementsList4);
app.post('/registration2',express.bodyParser(),registration.registerNewUser2);
app.post('/advertisement2',express.bodyParser(),advertisement.submitAdvertisement2);
app.get('/bidsList2', bidsList.getBidsList2);
app.post('/updateBid2',express.bodyParser(),advertisement.updateBid2);
app.get('/transactions2',transactions.getTransactions2);
app.get('/wonbidsList2', bidsList.getWonBidsList2);
app.post('/logoutUser2', express.bodyParser(), login.logoutUser2);
app.get('/getLoggedInUserProfile2', login.getLoggedInUserProfile2);
app.post('/addToCart2',express.bodyParser(),shopcart.addToCart2);
app.get('/getCart2', shopcart.getCart2);
app.post('/checkoutCart2',express.bodyParser(),shopcart.checkoutCart2);
app.post('/processPayment2',express.bodyParser(),shopcart.processPayment2);
app.post('/updateItemInCart',express.bodyParser(),shopcart.updateItemInCart);
app.post('/removeFromCart2',express.bodyParser(),shopcart.removeFromCart2);
app.get('/getLoggedInUser2', login.getLoggedInUser2);
app.get('/isAuthenticated', login.isAuthenticated);
//////////////////2nd gen//////////////////

logger.info('Express server listening on port ' + app.get('port'));

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
