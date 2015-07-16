var ai = angular.module('ai',['ngRoute']);

ai.config(function ($routeProvider){
	$routeProvider.
		when('/',{
			templateUrl: "templates/main.html",
			controller: 'mainCtrl'
		}).
		when('/dla', {
			templateUrl: 'templates/dla.html',
			controller: 'dlaCtrl'
		}).
		when('/wolfram', {
			templateUrl: 'templates/wolfram.html',
			controller: 'wolframCtrl'
		}).
		otherwise({
			redirectTo: "templates/404.html"
		});
});

ai.service('Processing', function(){
	var pjs;
	this.getPjsInstance = function(canvasId){
		pjs = Processing.getInstanceById(canvasId);
		if(pjs == null)
			setTimeout(this.getPjsInstance, 250);
		return pjs;
	};
});

ai.controller('mainCtrl', function($scope){
	$scope.message = 'Hello world';
});

ai.controller('dlaCtrl', function($scope, Processing){
	$scope.width = 300;
	$scope.height = 300;
	$scope.pixels = 2;
	$scope.playing = false;
	var pjs;

	$(document).ready(function(){
		pjs = Processing.getPjsInstance('dla-canvas');
		pjs.redimension($scope.width, $scope.height, $scope.pixels);
	});

	$scope.play = function(){
		pjs.play();
		$scope.playing = true;
	};

	$scope.pause = function(){
		pjs.pause();
		$scope.playing = false;
	};

	$scope.step = function(){
		pjs.step();
		$scope.playing = false;
	};

	$scope.reset = function(){
		pjs.reset();
	};

	$scope.redimension = function(){
		pjs.redimension($scope.width, $scope.height, $scope.pixels);
	};
});

ai.controller('wolframCtrl', function($scope, Processing){
	$scope.width = 40;
	$scope.height = 40;
	$scope.pixels = 4;
	$scope.rule = 22;
	$scope.playing = false;
	var pjs;

	$(document).ready(function(){
		pjs = Processing.getPjsInstance('canvas-wolfram');
		pjs.redimension($scope.width, $scope.height, $scope.pixels);
		pjs.reset();
	});

	$scope.play = function(){
		pjs.play();
		$scope.playing = true;
	};

	$scope.pause = function(){
		pjs.pause();
		$scope.playing = false;
	};

	$scope.step = function(){
		pjs.step();
		$scope.playing = false;
	};

	$scope.reset = function(){
		pjs.reset();
	};

	$scope.redimension = function(){
		pjs.redimension($scope.width, $scope.height, $scope.pixels);
		console.log("Width:" + $scope.width, "Height: " + $scope.height, "Pixels: " + $scope.pixels);
		pjs.reset();
	};

	$scope.setLiveColor = function(){
		pjs.setHexLiveColor($("#wolfram-live-color").val());
	};

	$scope.setDeadColor = function(){
		pjs.setHexDeadColor($("#wolfram-dead-color").val());
	};

	$scope.setLineColor = function(){
		pjs.setHexLineColor($("#wolfram-line-color").val());
	};

	$scope.setRule = function(){
		pjs.setRule($scope.rule);
	};
});