//Angular app: Functions controlling the front end in index.html
var app = angular.module('Maxflow',['MainCtrl','FileUploadModule']);

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

	app.directive('editorTab', function () {
		return {
			restrict:'E',
			templateUrl:'../views/editor-tab.html'
		};
	});

})();

