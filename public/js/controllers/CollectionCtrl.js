// public/js/controllers/CollectionCtrl.js
var app = angular.module('MainCtrl');

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
				if (newVal!==oldVal) collectionScope.getEventsForCollection(collectionScope.collectionSelected); 
	});

	//Watch for when the user changes the event under the collection in the drop down menu
	$scope.$watch(function () { return collectionScope.eventSelected; }, function(newVal, oldVal) {
			if (newVal!==oldVal) collectionScope.getCurrentEventData(collectionScope.eventSelected);
	});

	$scope.$on('setCollections', function (event, data) {
  		collectionScope.getCollections();
	});


	this.getCollections = function (lastFunction) {
		$http.get('/getcollections').success(function (collections) {
			collectionScope.collectionList = collections;
			//ALso share the collectionList with DataSharing service
			if (lastFunction=='add') collectionScope.collectionSelected = collectionScope.collectionNameSaved
			else if (collections.length>0) collectionScope.collectionSelected = collections[0].name;
		});
	};

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
