var loginApp = angular.module('login',['ngCookies']);

loginApp.factory('loggedInUserData',function(){
	var loggedInUserData = {
			user : 'zz@zmail.com',
			cart: [2,3,4,5,6,]
	};
}); 