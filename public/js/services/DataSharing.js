//Server to share data between controllers
(function () { 
var app = angular.module('DataSharingService',[]);

app.service('DataService', function () {
	var serviceScope = this;
	this.fileNameSelected = null;
	this.filePath = null;

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

});

})();