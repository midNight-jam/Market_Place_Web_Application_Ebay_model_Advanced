angular.module('bidslist').component('bidslist', {
	templateUrl: 'bidslist/bidslist.template.html',
	controller: [
		'$http',
		'$scope',
		'$location',
		function ($http, $scope, $location) {

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


			this.movedin = false;
			$scope.hoverIn = function () {
				var msg = 'Browsing the Bids list';
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


			var bidsListCtrl = this;
			$http({
				method: 'GET',
				url: '/bidsList2',
			}).then(function (res) {
				bidsListCtrl.bids = res.data.res;
			});

			this.bid = function (adv) {
				console.log('adv    ' + adv.name);
				$http({
					method: 'POST',
					url: '/updateBid2',
					data: {
						id: adv._id,
						name: adv.name,
						description: adv.description,
						seller: adv.seller,
						price: adv.price,
						quantity: adv.quantity,
						enddate: adv.enddate,
						bidamount: adv.newbidamount
					}
				}).success(function (data) {
					console.log(data);
					bidsListCtrl.getBidsList();
				}).error(function (error) {
					console.log('bad habbit!!');
				});
			};

			this.getBidsList = function () {
				$http({
					method: 'GET',
					url: '/bidsList2',
				}).then(function (res) {
					bidsListCtrl.bids = res.data.res;
				});
			};
		}]
});