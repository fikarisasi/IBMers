angular.module('starter.controllers', ['ngCordova','ionic'])

.controller('LoginCtrl', function($scope, ionicMaterialInk, $window, LoginService, $ionicPopup, $ionicLoading, $state) {
    ionicMaterialInk.displayEffect();
    $scope.data = {};
 
    $scope.login = function() {
		$ionicLoading.show({
			content: 'Login...',
			animation: 'fade-in',
			showBackdrop: true,
		});
		if($scope.data.username==""){
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Please fill your username'
			});
		}
		else if($scope.data.username!=""){
			LoginService.loginUser($scope.data.username,$scope.data.password).success(function(data) {
				var loginResult = data;
				$ionicLoading.hide();
				localStorage.setItem("username",$scope.data.username);
				$state.go('app.home');

			}).error(function(data) {
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Login Failed!',
					template: 'Your username is not in our database'
				});
			});
		}
		else{
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Login Failed!',
				template: 'Please fill your username'
			});
		}
	}
})

.controller('MainCtrl', function($scope, $ionicPopup,$ionicTabsDelegate,$ionicLoading,$ionicPopover, $state,ProfileService) {
	if(localStorage.getItem("userId")==null || localStorage.getItem("userId")==""){
		$state.go('login');
	}
	$scope.menuProfile = {};
	$scope.currentLocation = {};
	//do before main view loaded
	$scope.$on('$ionicView.beforeEnter', function(){
		//get user profile data
		ProfileService.getProfile(localStorage.getItem("userId")).success(function(data) {
			$scope.menuProfile = data[0];
			$ionicLoading.hide();
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Login Failed!',
				template: 'Error get customer profile data'
			});
		});
		$scope.role="customer";
		//get user current location
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.currentLocation = {"coordinates": [position.coords.longitude,position.coords.latitude],"type": "Point"};
			}, function() {
				$scope.currentLocation = {"coordinates": [112.531359+(Math.random()/100),-7.88016],"type": "Point"};
			});
		}
		else {
			$scope.currentLocation = {"coordinates": [112.531359+(Math.random()/100),-7.88016],"type": "Point"};
		}
	});
	$scope.back = function(){
		$state.go('app.home');
	}
	$scope.logout = function(){
		localStorage.removeItem("userId");
		$state.go('login');
	};
})
.controller('HomeCtrl', function($scope, $state, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
		setTimeout(function (){
			$state.go($state.current, {}, {reload: true});
		}, 500);
	};
	$ionicLoading.hide();
})

.controller('PostDetailCtrl', function($scope, $state, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	//implement logic here
})

.controller('RegisterCtrl', function($scope, $state, RegisterService, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	//implement logic here
	$scope.data={};
	$scope.addUser = function(){
		RegisterService.tambahUser($scope.data.username, $scope.data.password, $scope.data.email).success(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Succes!',
				template: 'Berhasil register'
			});
			$state.go($state.current, {}, {reload: true});
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal register'
			});
		});
	}
})

.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform,$ionicLoading) {  
	//implement logic here
})