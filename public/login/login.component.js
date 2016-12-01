angular.module('login')
.component('login', {
	templateUrl: 'login/login.template.html',
	controller: [
		'$http',
		'$location',
		'$scope',
		'$cookies',
		function ($http, $location, $scope, $cookies) {
			console.log('in controller username');

			$scope.signup = function () {
				$location.path('/registration');
			};

			$scope.invalid_login = true;
			$scope.login = function () {
				$http({
					method: 'POST',
					url: '/login',
					data: {
						"email": $scope.email,
						"password": $scope.password
					}
				}).then(function (res) {
					if (res.data.Status === 'failed') {
						$scope.invalid_login = false;
					}
					else {
						$location.path('/advertisementslist');
					}
				});
			};
		}]
});