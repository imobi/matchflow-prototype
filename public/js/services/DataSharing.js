//Server to share data between controllers
(function () { 
var app = angular.module('DataSharingService',[]);

app.service('DataService',['$http','$rootScope', function ($http,$rootScope) {
	var serviceScope = this;
	this.fileNameSelected = null;
	this.filePath = null;
	this.collections = [];
	this.videoCollection = [];

	//Methods to get and set file name and path from video upload
	this.setFileNameSelected = function (value) {
		serviceScope.fileNameSelected=value;
	};
	this.getFileNameSelected = function () {
		return serviceScope.fileNameSelected;
	};
	
	this.setFilePath = function (value) {
		serviceScope.filePath=value;
	};
	this.getFilePath = function () {
		return serviceScope.filePath;
	};

	//Methods for getting and setting (updating) collections of events and videos
	this.setCollections = function () {
		$http.get('/getcollections').success(function (collections) {
			serviceScope.collections= collections;
			$rootScope.$broadcast('setCollections');
		});
		
	};

	this.setConvertedVideos = function (newVideoAdded) {
		$http.get('/getconvertedvideos').success(function (videoCollection) {
			serviceScope.videoCollection = videoCollection;
			if (newVideoAdded) $rootScope.$broadcast('newVideoAdded');
			else $rootScope.$broadcast("setVideos");
		});			
	};

	this.getCollections = function () {
		return serviceScope.collections;		
	};

	this.getConvertedVideos = function () {
		return serviceScope.videoCollection;		
	};

}]);

})();