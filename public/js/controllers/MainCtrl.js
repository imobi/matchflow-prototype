// public/js/controllers/MainCtrl.js
var app= angular.module('MainCtrl', ['DataSharingService']);
(function() {	
	var tabScope;

	app.controller('TabCtrl' ,['$scope','$controller','DataService', function($scope,$controller, DataService) {
	    this.currentTab = 1;
	    tabScope = this;
	    //Watches when the current tab changes
	    $scope.$watch(function () { return tabScope.currentTab; }, function(newVal, oldVal) {
    		//On project manager tab load
    		if (newVal==1) {
    			DataService.setCollections();
    			DataService.setConvertedVideos();    			
    		}

            //On collection manager tab load
            else if (newVal==2) {
                DataService.setCollections();
            }

    		//On video manager tab load
    		else if (newVal==3) {
    			DataService.setConvertedVideos();
    		}
    	});

	}]);
})();
