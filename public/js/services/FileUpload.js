//Dependencies and servcies for file upload
(function () {
	var app = angular.module('FileUploadModule',['DataSharingService']);
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

	app.controller('UploadControl', ['$http','DataService', function($http,DataService){ 		
		var control = this;
		control.fileName = "MySportsMatch"
		control.VideoFile = null;
		control.fileInfo = {};
		control.showVideoPlayer = false;
		control.showConvertVideoButton = false;
		control.completed = false;
		control.fullFileName = "Uploading video...";
	    this.uploadFile = function(){
	    	sendFileName();
	    	this.showVideoInformation = true;
	        var fd = new FormData();
	        var file = control.VideoFile;	     
	        control.originalFileInfo= file;
	        fd.append('file', file);
   
	        control.uploadStatus= 'Uploading video, please wait...';	        
	        $http.post("/upload", fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(data){
	        	control.uploadStatus = data[0]+" was uploaded to "+data[1];
	        	control.fullFilePath = data[1].split('\\').slice(1).join('\\');
	        	control.fullFileName = data[1].split('\\').pop();
	        	if (['mp4','ogg','wemb'].indexOf(data[0].split('.').pop().toLowerCase())>-1) control.showVideoPlayer = true;
	        	else control.showVideoPlayer = false;
	        	DataService.setFileNameSelected(control.fullFileName);
	        	DataService.setFilePath(data[1]);
	        	control.showConvertVideoButton = true;
	        	control.completed = true;


	        })
	        .error(function(){
	        	control.uploadStatus = "Error uploading file, try again."
	        });
    	};

      	function sendFileName() {
    		$http.post('/fileName', {file_name:control.fileName}).success(function(data) {
    			console.log(data);
    		});
    	};

	}]);

})();