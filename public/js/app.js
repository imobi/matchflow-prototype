//Angular app: Functions controlling the front end in index.html
var app = angular.module('Maxflow',['FileUploadModule']);

(function () {
	app.directive('showSecret',function () {
		return {
			restrict:'E',
			templateUrl:'../views/show-secret.html',
			controller: function () {
				this.permissions = false;
			},
			controllerAs: 'secret'
		};
	});
})();

