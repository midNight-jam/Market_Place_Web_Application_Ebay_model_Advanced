angular.module('header')
.component('header', {
	templateUrl: 'header/header.template.html',
	controller: [
		'$http',
		'$scope',
		'$location',
		function ($http, $scope, $location) {
			var headerCtrl = this;
			headerCtrl.loggedIn = false;
			headerCtrl.loggedOut = true;
			console.log(headerCtrl.loggedIn);
			$http({
				method: 'GET',
				url: '/getLoggedInUser2'
			}).then(function (res) {
				headerCtrl.loggedInUser = res.data.user;
				headerCtrl.loggedIn = true;
				headerCtrl.loggedOut = !headerCtrl.loggedIn;
				console.log(headerCtrl.loggedIn);
				console.log(headerCtrl.loggedOut);
			});

			this.profile = function () {
				$location.path('/profile');
			};

			this.bids = function () {
				$location.path('/bidslist');
			};

			var movedin = false;
			this.hoverIn = function () {
				var msg = 'Browsing the cart';
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

			this.hoverOut = function () {
				movedin = false;
			};


			this.mytransactions = function () {
				$http({
					method: 'GET',
					url: '/transactions2',
				}).then(function (res) {
					$location.path('/transactions');
				});
			};

			this.submitAdd = function () {
				$location.path('/advertisement');
			};

			this.logout = function () {
				$http({
					method: 'POST',
					url: '/logoutUser2'
				}).then(function (res) {
					headerCtrl.loggedInUser = '';
					headerCtrl.loggedIn = false
					$location.path('/');
				});
			}

			this.showCart = function () {
				$location.path('/cart');
			}
		}]
});