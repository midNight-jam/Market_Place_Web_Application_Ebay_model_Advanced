angular.module('advertisementslist').component('advertisementslist',{
	templateUrl:'advertisementslist/advertisementslist.template.html',
	controller:['$http',
	            '$scope',
	            '$location',
	            function($http,$scope,$location){

								$http({
									method: 'GET',
									url: '/isAuthenticated'
								}).then(function (res) {
									if (res.data.authenticated) {
										console.log('okay  ' + res.data.user);
									}
									else {
										$location.path('/login');
									}
								});

		var advertisementsListCtrl  = this;
		$http({
			method:'GET',
			url:'/getAdvertisementsList4',
		}).then(function(res){
			if(res.data.err){
			  alert('Please try after some time. Error - '+res.data.err);
      }
      else{
        advertisementsListCtrl.advertisements = res.data.res;
      }
		});

    this.movedin = false;
    $scope.hoverIn = function () {
      var msg = 'Browsing the advertising list';
      movedin = true;
      $http({
        method: 'POST',
        url: '/logger',
        data: {
          text: msg
        }
      }).then(function (res) {
        //console.log('sent');
      });
    };

  $scope.hoverOut = function () {
      movedin = false;
    };

    $scope.log = function(msg){
			$http({
				method:'POST',
				url:'/logger',
				data:{
					text:msg
				}
			}).then(function(res){
				//console.log('sent');
			});
		};

		$scope.addToCart = function(adv){
			$http({
				method:'POST',
				url:'/addToCart2',
				data :{
					id : adv._id,
					name : adv.name,
					description : adv.description,
					seller : adv.seller,
					price : adv.price,
					quantity : adv.quantity
				}
			}).success(function(data){
				console.log(data);
				alert('Item added to your cart, use show cart.')
			}).error(function(error){
          alert('Please try after some time. Error - '+res.data.err);
			});
		};
	}]
});