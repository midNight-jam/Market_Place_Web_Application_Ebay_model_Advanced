angular.module('ebayj')
.config(['$locationProvider','$routeProvider',
         function config($locationProvider, $routeProvider){
			$locationProvider.hashPrefix('!');
			 $routeProvider.
		        when('/login', {
		          template: '<login></login>'
		        }).
		        when('/registration', {
		        	template:'<registration></registration>'
		        }).
		        when('/advertisementslist',{
		        	template:'<advertisementslist></advertisementslist>'
		        }).
		        when('/advertisement',{
		        	template:'<advertisement></advertisement>'
		        }).
		        when('/payment',{
		        	template:'<payment></payment>'
		        }).
		        when('/transactions',{
		        	template:'<transactions></transactions>'
		        }).
		        when('/cart',{
		        	template:'<cart></cart>'
		        }).
		        when('/bidslist',{
		        	template:'<bidslist></bidslist>'
		        }).
		        when('/profile',{
		        	template:'<profile></profile>'
		        }).
		        otherwise('/login');
		    }
]);

