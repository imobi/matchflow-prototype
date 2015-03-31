// public/js/controllers/MainCtrl.js
(function() {
	var app= angular.module('MainCtrl', ['DataSharingService']);
	var tabScope;
	var converterScope;

	app.controller('TabCtrl' ,['$scope','$controller', function($scope,$controller) {
	    this.currentTab = 1;
	    tabScope = this;
	    $scope.$watch(function () { return tabScope.currentTab; }, function(newVal, oldVal) {
    		if (newVal==4) { 
   					converterScope.getVideoMetaData(); //And call the method on the newScope.
    		}
    	});

	}]);

	app.controller('ConverterCtrl', ['$http','DataService',function ($http,DataService) {
		converterScope = this;
		//Conversion status
		this.conversionStatus = "";
		this.showConversionStatus = false;
		this.conversionComplete =false;
		this.showConvertButton = false;

		//Initial video meta data variables as generic statuses, note
		this.currentResolution = this.currentAspect = this.currentFR = this.currentFormat = this.currentCodec = "Fetching data...";
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
				converterScope.showConvertButton = true;
			});
		};

		this.startConversion = function () {
			converterScope.showConversionStatus = true;
			converterScope.showConvertButton = false;
			converterScope.conversionStatus = "Converting video. Please wait...";			
			conversionData = {
				fileName:converterScope.getSelectedFileName(),
				filePath:converterScope.getFilePath(),
				resolution: converterScope.recResParameter,
				framerate:converterScope.recFR
			};
			$http.post('/convert', conversionData).success(function (data) {		
				converterScope.conversionComplete = true;
				converterScope.conversionStatus = "Conversion successfully completed.";
				console.log(data);
				
			})
			.error(function (data) {
				converterScope.conversionStatus = data;
			});
		};
	}]);
	
	app.controller('ProjectCtrl',['$http','DataService', function ($http,DataService) {
		//Define scope
		var projectScope = this;
		this.projectSubmittedResult = false;
		this.projectSubmittedError = false;	
		//Get project list
		this.getProjects = function () {
			$http.get('/getprojects').success(function (data) {
				projectScope.projectList = data;
				if (data.length>0) projectScope.projectSelected = data[0].name;
			});
		};
		this.getProjects();

		this.addProject = function () {
			var projectData = {"projectName":projectScope.projectName,								
								"datePlayed": projectScope.datePlayed,
								"localTeam":projectScope.localTeam,								
								"oppositionTeam":projectScope.oppositionTeam,
								"season":projectScope.season,
								"competition":projectScope.competition,
								"localTeamScore":projectScope.localTeamScore,
								"oppositionTeamScore":projectScope.oppositionTeamScore
							};		
			$http.post('/addproject', projectData).success(function (response) {
				projectScope.projectSubmittedResult = response.success;
				//Let's update our project list!
				if (projectScope.projectSubmittedResult) projectScope.getProjects();
				else {
					if (response.err.code=11000) projectScope.collectionSubmittedError = "A project already exists with this name! Try a different name."
					else projectScope.collectionSubmittedError = response.error.errmsg;
				} 
			});
		};
	}]);

	app.controller('CollectionCtrl',['$http','$scope','DataService',function($http,$scope,DataService) {

		var collectionScope = this;
		this.collectionNameSaved = "";
		this.collectionSubmittedResult = false;
		this.collectionSubmittedError = false;
		this.collectionDeletedResult = false;
		this.collectionDeletedError = false;
		this.eventDeletedResult = this.eventDeletedError = false;
		this.statusEventAdded = false;
		this.errorEventAdded = false;
		this.eventUpdatedError = false;
		this.eventUpdatedResult = false;
		this.lagTime = this.leadTime = 10;


		//Watch for when the user changes the collection in the drop down menu
		$scope.$watch(function () { return collectionScope.collectionSelected; }, function(newVal, oldVal) {
   				collectionScope.getEventsForCollection(collectionScope.collectionSelected); 
    	});

		//Watch for when the user changes the event under the collection in the drop down menu
    	$scope.$watch(function () { return collectionScope.eventSelected; }, function(newVal, oldVal) {
    			collectionScope.getCurrentEventData(collectionScope.eventSelected);
    	});

		this.getCollections = function (lastFunction) {
			$http.get('/getcollections').success(function (collections) {
				collectionScope.collectionList = collections;
				//ALso share the collectionList with DataSharing service
				if (lastFunction=='add') collectionScope.collectionSelected = collectionScope.collectionNameSaved
				else if (collections.length>0) collectionScope.collectionSelected = collections[0].name;
			});
		};
		this.getCollections('none');

		this.addCollection = function () {
			collectionScope.collectionSubmittedError = false;
			collectionScope.collectionSubmittedResult = false;
			var collectionData = {"collectionName":collectionScope.collectionName};
			$http.post('/addcollection', collectionData).success(function (response) {
				collectionScope.collectionSubmittedResult = response.success;
				collectionScope.collectionNameSaved = collectionScope.collectionName;
				//Call get collections again to update list of collections to include new collection added.
				if (collectionScope.collectionSubmittedResult) {
					collectionScope.getCollections('add');	
					collectionScope.collectionName = "";			
				}
				else {
					if (response.error.code==11000) collectionScope.collectionSubmittedError = "A collection already exists with this name! Try a different name."
					else collectionScope.collectionSubmittedError = response.error.errmsg;
				}
			});
		};

		this.deleteCollection = function () {
			collectionScope.collectionDeletedError = false;
			collectionScope.collectionDeletedCollectionNameSave = collectionScope.collectionSelected;
			$http.post('/deletecollection', {"collectionName":collectionScope.collectionSelected}).success(function (response) {
				collectionScope.collectionDeletedResult = response.success;
				if (response.success) collectionScope.getCollections('delete');
				else collectionScope.collectionDeletedError = response.error.errmsg;
			});
		};

		//This function gets all the events under the selected collection (passed as collectionName)
		//lastFunction passes the name of the function that was just executed so we know which event to set as currently selected in the drop down.
		//If an event has just been added or updated, then select that event. Other select the first element at index zero from all events pulled.
		this.getEventsForCollection = function (collectionName, lastFunction) {
			$http.post('/getevents',{"collectionName":collectionScope.collectionSelected}).success(function (events) {
				collectionScope.eventsForCollection = events;
				collectionScope.numberOfEvents = events.length;
				if (lastFunction == 'add') collectionScope.eventSelected = collectionScope.savedEventName;
				else if (lastFunction == 'update') collectionScope.eventSelected = collectionScope.updatedSavedEventName;
				else if (events.length>0) collectionScope.eventSelected = events[0].event_name;
			});
		};		

		//Method to add an event to the current selected collection
		this.addEvent = function () {
			collectionScope.statusEventAdded = false;
			collectionScope.errorEventAdded = false;
			//Collect the event data input by the user into one object
			var eventData = {"collection_name":collectionScope.collectionSelected,
							"event_name":collectionScope.eventName,
							"lag_time":collectionScope.lagTime,
							"lead_time":collectionScope.leadTime
						};
			collectionScope.savedEventName = collectionScope.eventName;
			//Valid the event name, check if duplicate
			var validationResult = collectionScope.validateEvent(collectionScope.savedEventName);
			if (validationResult[0]==0) {
				collectionScope.errorEventAdded = validationResult[1];
				return;
			}	
			//Add event to database
			$http.post('/addevent',eventData).success(function (response) {		
				collectionScope.statusEventAdded = response.success;
				if (collectionScope.statusEventAdded) {
					collectionScope.getEventsForCollection(collectionScope.selectedCollection,'add');
					collectionScope.numberOfEvents = response.number_of_events;
					collectionScope.events = response.events;	
					collectionScope.eventName = "";					
				}
				else {
					collectionScope.errorEventAdded = response.error.errmsg;
				}
			});
		};

		//This method uses the current event name (taken from the drop down) and finds the index of the event inside the eventsForCollection array
		//It then gets the existing event information (lag_time and lead_time) which will be used to populate the Edit event modal fields.
		this.getCurrentEventData = function () {
			collectionScope.currentEventName = collectionScope.eventSelected;
			for (var i=0;i<collectionScope.eventsForCollection.length;i++) {
				if (collectionScope.eventsForCollection[i].event_name==collectionScope.currentEventName)
				{				
					collectionScope.currentLagTime = collectionScope.eventsForCollection[i].lag_time;
					collectionScope.currentLeadTime = collectionScope.eventsForCollection[i].lead_time;
					break;
				}
			}
		};

		this.updateEvent = function () {
			//Variables that control ng-show of "error" and "success" alerts
			collectionScope.eventUpdatedResult = false;
			collectionScope.eventUpdatedError = false;
			collectionScope.updatedSavedEventName = collectionScope.currentEventName;
			//Validate the event name
			//Only validate if name has been changed
			if (collectionScope.updatedSavedEventName!==collectionScope.eventSelected) {
				var validationResult = collectionScope.validateEvent(collectionScope.updatedSavedEventName);
				if (validationResult[0]==0) {
					collectionScope.eventUpdatedError = validationResult[1];
					return;
				}
			}		

			var newEventData = {"collection_selected":collectionScope.collectionSelected,
				"event_name":collectionScope.updatedSavedEventName,
				"lag_time":collectionScope.currentLagTime,
				"lead_time":collectionScope.currentLeadTime,
				"event_selected": collectionScope.eventSelected
			};
			$http.post('/updateevent', newEventData).success(function (response) {
				if (response.success) { 
					collectionScope.eventUpdatedResult = true;
					collectionScope.getEventsForCollection(collectionScope.collectionSelected,"update");

				}
				else collectionScope.eventUpdatedError = success.error.errmsg;
			});
		};

		this.deleteEvent = function () {
			collectionScope.eventDeletedResult = false;
			collectionScope.eventDeletedError = false;
			collectionScope.eventDeletedNameSaved = collectionScope.eventSelected;
			$http.post('/deleteevent', {"collectionName":collectionScope.collectionSelected,"eventName":collectionScope.eventDeletedNameSaved}).success(function (response) {
				collectionScope.eventDeletedResult = response.success;
				if (response.success) collectionScope.getEventsForCollection('delete');
				else collectionScope.eventDeletedError = response.error.errmsg;
			});
		};



		//Method to ensure that a duplicate event name is not added or updated
		this.validateEvent = function (name) {
			for (var event=0; event < collectionScope.eventsForCollection.length;event++) {
				if (collectionScope.eventsForCollection[event].event_name == name) return [0,"An event with that name already exists in this collection. Please use a different name"];
			}
			return [1];
		};

		this.boxClosed = function () {
			//We can reset our variables now
			collectionScope.collectionDeletedResult = false;
			collectionScope.collectionDeletedError = false;
			collectionScope.eventDeletedError = collectionScope.eventDeletedResult = false;
			collectionScope.eventUpdatedResult = false;
			collectionScope.eventUpdatedError = false;
			collectionScope.collectionSubmittedError = collectionScope.collectionSubmittedResult = false;
			collectionScope.statusEventAdded = collectionScope.errorEventAdded = false;
		};

	}]);




})();
