// public/js/controllers/MainCtrl.js
(function() {
	var app= angular.module('MainCtrl', ['DataSharingService']);
	var tabScope;
	var converterScope;


	app.controller('TabCtrl' ,function($scope) {
	    this.currentTab = 1;
	    tabScope = this;

	    $scope.$watch(function () { return tabScope.currentTab; }, function(newVal, oldVal) {
    		if (newVal==2) { 
    			converterScope.getVideoMetaData();
    		}
    	});
	});



	app.controller('ConverterCtrl', ['$http','DataService',function ($http,DataService) {
		converterScope = this;

		//Conversion status
		this.conversionStatus = "";
		this.showConversionStatus = false;

		//Initial video meta data variables as generic statuses, note
		this.currentResolution = this.currentAspect = this.currentFR = this.currentFormat = this.currentCodec = "Fetching...";
		this.recResolution = this.recAspect = this.recFR = this.recFormat = this.recCodec = "Calculating..."

		//Methods using the DataService service to access the file name and path of the selected file that was uploaded.
		this.getSelectedFileName = function () {
			return DataService.getFileNameSelected();
		};

		this.getFilePath = function () {
			return DataService.getFilePath();
		};

		this.getVideoMetaData = function () {
			console.log("Getting video meta data...");
			fileData = {fileName:converterScope.getSelectedFileName(), filePath:converterScope.getFilePath()};
			$http.post('/getVideoMetaData', fileData).success(function (metadata) {				
				//Extract video meta data and store in varialbles in the ConverterCtrl scope so it can be accessed through the html				
				//Resolution
				var width = metadata.streams[0].width;
				var height = metadata.streams[0].height;
				if (width== undefined||height==undefined) converterScope.currentResolution = "unknown";
				else converterScope.currentResolution = metadata.streams[0].width+'x'+metadata.streams[0].height;
				//Aspect Ratio
				var aspect = metadata.streams[0].display_aspect_ratio;
				if (aspect == "0:1" || aspect == undefined) converterScope.currentAspect = "unknown";
				else converterScope.currentAspect = aspect;
				//Frame Rate
				var fr = metadata.streams[0].r_frame_rate.split('/');
				if (fr[0] == "0" || fr == undefined) converterScope.currentFR = 'unknown';
				else converterScope.currentFR = Math.round(fr[0]/fr[1]);
				//Format (.mp4 etc.)
				converterScope.currentFormat = fileData.filePath.split('/').pop().split('.').pop();
				//Codec
				if (metadata.streams[0].codec_name == undefined) converterScope.currentCodec = "unknown";
				converterScope.currentCodec = metadata.streams[0].codec_name;

				//Now Calculate Recommended Settings
				//Resolution: If width is less than 640 or unknown, leave resolution the same. Otherwise convert to 640x? (compute height based on default aspect)
				if (converterScope.currentResolution!='unknown' && width<640) { 
					converterScope.recResolution = converterScope.currentResolution; //convert the file using 100% resolution (aspect stays as default)
					converterScope.recResParameter = '100%'; //this variable should be passed to ffmpeg
				}
				else if (converterScope.currentResolution == 'unknown') {
					converterScope.recResolution = "Keep Original";
					converterScope.recResParameter = "640x?"
				}
				//Width is bigger than 640
				else {
					if (converterScope.currentAspect = '16:9') converterScope.recResolution = '640x480';
					else if (converterScope.currentAspect = '4:3') converterScope.recResolution = '640x360';
					else converterScope.recResolution = converterScope.recResolution = '640x480';
					converterScope.recResParameter = '640x?'; //this variable should be passed to ffmpeg
				}
				//Aspect Ratio
				if (converterScope.currentAspect!='unknown') converterScope.recAspect = converterScope.currentAspect;
				else converterScope.recAspect = "Keep Original";
				//Frame Rate
				if (converterScope.currentFR!='unknown' && converterScope.currentFR <=30) converterScope.recFR = converterScope.currentFR;
				else if (converterScope.currentFR >35) converterScope.recFR = Math.round(converterScope.currentFR/2);
				else converterScope.recFR = '30';
				//Format
				converterScope.recFormat = 'mp4';
				//Codec
				converterScope.recCodec = 'h264';
			});
		};

		this.startConversion = function () {
			converterScope.showConversionStatus = true;
			converterScope.conversionStatus = "Converting video. Please wait...";			
			conversionData = {
				fileName:converterScope.getSelectedFileName(),
				filePath:converterScope.getFilePath(),
				resolution: converterScope.recResParameter,
				framerate:converterScope.recFR
			};
			$http.post('/convert', conversionData).success(function (data) {
				converterScope.conversionStatus = data;
			});
		};


	}]);
})();
