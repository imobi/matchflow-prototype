//Dependencies and servcies for file upload
(function () {
	var app = angular.module('FileUploadModule',[]);
	app.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);

	app.controller('UploadControl', ['$http', function($http){ 
		console.log("Controller binded");  		
		var control = this;
		control.VideoFile = null;
		control.fileInfo = {};
	    this.uploadFile = function(){
	    	sendFileName();
	    	this.showUploadInformation = true;
	        var fd = new FormData();
	        var file = control.VideoFile;	     
	        control.originalFileInfo= file;
	        fd.append('file', file);
	        fd.append('name', this.fileName);	   
	        control.uploadStatus= 'Starting file upload...';
	        
	        $http.post("/upload", fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(data){
	        	control.success = data[0]+" was uploaded to "+data[1];
	        })
	        .error(function(){
	        	control.uploadStatus = "Error uploading file, try again"
	        });
    	};

    	function sendFileName() {
    		$http.post('/fileName', {file_name:control.fileName}).success(function(data) {
    			console.log(data);
    		});
    	};

	}]);

})();