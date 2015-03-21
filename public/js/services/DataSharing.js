//Server to share data between controllers
(function () { 
var app = angular.module('DataSharingService',[]);

app.service('DataService', function () {
	console.log('Data service running in bg');
	var serviceScope = this;
	this.showConverterValue = false;
	this.setShowConverterValue = function (value) {
		serviceScope.showConverterValue=value;
	};
	this.getShowConverterValue = function () {
		return serviceScope.showConverterValue;
	};
});

})();