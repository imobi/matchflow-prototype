//Angular app: Functions controlling the front end in index.html
var app = angular.module('Maxflow',['MainCtrl','FileUploadModule','ui.bootstrap']);

(function () {
	app.directive('showConverter',function () {
		return {
			restrict:'E',
			templateUrl:'../views/converter.html',
			controller: function () {
				this.permissions = false;
			},
			controllerAs: 'secret'
		};
	});

	app.directive('uploadTab',function () {
		return {
			restrict:'E',
			templateUrl:'../views/upload-tab.html'
		};
	});

	app.directive('converterTab',function() {
		return {
			restrict:'E',
			templateUrl:'../views/converter-tab.html'
		};
	});

	app.directive('videoTable',function () {
		return {
			restrict:'E',
			templateUrl:'../views/videoInfoTable.html'
		};
	});

	app.directive('projectmanagerTab',function () {
		return {
			restrict:'E',
			templateUrl:'../views/projectmanager-tab.html'
		};
	});

	app.directive('collectionmanagerTab',function () {
		return {
			restrict:'E',
			templateUrl:'../views/collectionmanager-tab.html'
		};
	});

	app.directive('collectionModals',function () {
		return {
			restrict:'E',
			templateUrl:'../views/collection-modals.html'
		};
	});

})();

