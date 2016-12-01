angular.module('cart').component('cart', {
	templateUrl: 'cart/cart.template.html',
	controller: ['$http',
		'$scope',
		'$location',
		function ($http, $scope, $location) {
			var cartCtrl = this;
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


			$http({
				method: 'GET',
				url: '/getCart2'
			}).success(function (data) {
				console.log(data);
				$scope.cart = data.res[0].item;
				$scope.totalAmount = data.amount;
			}).error(function (error) {
				console.log('bad habbit!!');
			});


			$http({
				method: 'POST',
				url: '/checkoutCart2'
			}).then(function (res) {
				cartCtrl.payamount = res.data.totalAmont;
			});

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

			this.updateQuantity = function (item) {
				$http({
					method: 'POST',
					url: '/updateItemInCart',
					data: {
						id: item.id,
						name: item.name,
						description: item.description,
						seller: item.seller,
						price: item.price,
						quantity: item.quantity
					}
				}).success(function (data) {
					console.log(data);
					//alert('Item added to your cart, use show cart.')
				}).error(function (error) {
					console.log('bad habbit!!');
				});
			};

			this.cartCheckout = function () {
				console.log('checking out cart');
				$location.path('/payment');
			}

			var cartCtrl = this;
			this.removeItem = function (item) {
				$http({
					method: 'POST',
					url: '/removeFromCart2',
					data: {
						item: item
					}
				}).then(function (res) {
					cartCtrl.showCart();
				});
			};

			this.showCart = function () {
				$http({
					method: 'GET',
					url: '/getCart2'
				}).success(function (data) {
					console.log(data);
					$scope.cart = data.res[0].item;
					$scope.totalAmount = data.amount;
				}).error(function (error) {
					alert('Please try after some time. Error - '+res.data.err);
				});
			}
		}]

});