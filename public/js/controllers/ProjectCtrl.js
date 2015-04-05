var app = angular.module('MainCtrl');

app.controller('ProjectCtrl',['$http','$scope','DataService', function ($http, $scope, DataService) {
	//Define scope
	var projectScope = this;
	this.projectSubmittedResult = false;
	this.projectSubmittedError = false;	
	this.projectDeletedResult = false;
	this.projectDeletedError = false;
	projectScope.videoCollection = [];
	projectScope.collectionList = [];


	//Set event emitted so new video list data has been set by DataSharing service
	$scope.$on('setVideos', function (event, data) {
  		projectScope.getVideos();
	});

	$scope.$on('setCollections', function (event, data) {
  		projectScope.getCollections();
	});

	//Get project list
	this.getProjects = function (projectAdded) {
		$http.get('/getprojects').success(function (data) {
			projectScope.projectList = data;
			if (projectAdded) projectScope.projectSelected = projectAdded;
			else if (data.length>0) projectScope.projectSelected = data[0].name;
		});
	};
	this.getProjects();

	//Method to get collections list using DataService
	this.getCollections = function () {
		projectScope.collectionList = DataService.getCollections();
		if (projectScope.collectionList.length>0) projectScope.selectedCollection= projectScope.collectionList[0].name;
	};		

	this.getVideos = function () {
		projectScope.videoCollection = DataService.getConvertedVideos();
		if (projectScope.videoCollection.length>0) projectScope.videoSelected = projectScope.videoCollection[0].video_name;
	}	

	this.addProject = function () {
		projectScope.projectSubmittedResult = projectScope.projectSubmittedError = false;
		var projectData = {"projectName":projectScope.projectName,								
							"datePlayed": projectScope.datePlayed,
							"localTeam":projectScope.localTeam,								
							"oppositionTeam":projectScope.oppositionTeam,
							"season":projectScope.season,
							"competition":projectScope.competition,
							"localTeamScore":projectScope.localTeamScore,
							"oppositionTeamScore":projectScope.oppositionTeamScore,
							"collection":projectScope.selectedCollection,
							"video":projectScope.videoSelected
						};		
		$http.post('/addproject', projectData).success(function (response) {
			projectScope.projectSubmittedResult = response.success;
			//Let's update our project list!
			if (projectScope.projectSubmittedResult) projectScope.getProjects(projectData.projectName);
			else {
				if (response.error.code=11000) projectScope.projectSubmittedError = "A project already exists with this name! Try a different name."
				else projectScope.projectSubmittedError = response.error.errmsg;
			} 
		});
	};

	this.deleteProject = function () {
		projectScope.projectDeletedProjectNameSave = projectScope.projectSelected;
		$http.post('/deleteproject', {"projectName":projectScope.projectSelected}).success(function (response) {
			projectScope.projectDeletedResult = response.success;
			if (projectScope.projectDeletedResult) projectScope.getProjects();
			else projectScope.projectDeletedError = response.error.errmsg;
		});
	};

	this.boxClosed = function() {
		projectScope.projectDeletedResult = false;
		projectScope.projectDeletedError = false;
		projectScope.projectSubmittedError = false;
		projectScope.projectSubmittedResult = false;
	}

}]);