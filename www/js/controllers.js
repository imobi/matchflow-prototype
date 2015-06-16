'use strict';

/* Controllers */
angular.module('matchflow.controllers', [])
    .controller('MainController', ['$scope', function ($scope) {
        // GENERAL CONFIG
        $scope.user = {
            id: 'default-user',
            name: 'Default User',
            loginTime: 0,
            tagTemplateList: [
                {
                    name: 'default',
                    tags: [
                        /*
                         * {
                         *     id: 'tag1'
                         *     name: 'Tag 1'
                         *     before: 5000,
                         *     after:  2000
                         * }
                         * 
                         */
                    ]
                }
            ],
            // will change this later:  category > team > season
            categoryList: [
                {
                    name: 'none'
                }
            ],
            teamList: [
                {
                    name: 'none'
                }
            ],
            seasonList: [
                {
                    name: 'none'
                }
            ],
            projectList: [
                // list of project id's
                'default'
            ],
            highlightsList: [
                // list of highlights objects id's
            ]
        };
    }]).controller('DashboardController', ['$scope', function ($scope) {

    }]).controller('AnalyzerController', ['$scope', '$compile', '$http', '$location', function ($scope, $compile, $http, $location) {
        $scope.replaceAll = function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        };
        $scope.timestamp = new Date().getTime();
        $scope.play = false;
        /*--- this counter is used to synchronize adding of tags to taglines ---*/
        $scope.callback = function () {
            // get scope here
            var scope = angular.element('#pageContent').scope();
            if (scope) {
                if (scope.timeoutID) {
                    clearTimeout(scope.timeoutID);
                }
                scope.timestamp = new Date().getTime() / 100;
                var phase = scope.$root.$$phase;
                if (phase !== '$apply' && phase !== '$digest') {
                    scope.$apply();
                }
                return setTimeout(scope.callback, 50);
            } else {
                return false;
            }
        };
        $scope.timeoutID = $scope.callback();
        /*************************************/

        
        // PROJECT SPECIFIC
        $scope.currentProjectConfiguration = {
            id: 'unknown',
            name: 'Unknown',
            selectedCategory: {
                name: 'none'
            },
            selectedTeam: {
                name: 'none'
            },
            selectedSeason: {
                name: 'none'
            },
            selectedGameDate: '',
            defaultTemplate: undefined, // will change these when loading, this is the basic defaults
            selectedTemplate: undefined,
            tags: [
                /* list of the current applied tags (NOT A TEMPLATE, CAN CONSIST OF TAGS FROM MULTIPLE TEMPLATES)
                 * {
                 *     id: 'tag1'
                 *     name: 'Tag 1'
                 *     // these are custom positions, template is the init value
                 *     before: 4532,
                 *     after:  2106
                 *     timestamp : 12390120390293
                 *     
                 * }
                 * 
                 */
            ]
        };
        // INPUT FORMS
        $scope.newProject = {
            name: '',
            selectedCategory: $scope.user.categoryList[0],
            selectedTeam: $scope.user.teamList[0],
            selectedSeason: $scope.user.seasonList[0],
            selectedGameDate: '',
            defaultTemplate: $scope.user.tagTemplateList[0]

        };
        $scope.editCurrentProject = {
            selectedCategory: {
                name: 'none'
            },
            selectedTeam: {
                name: 'none'
            },
            selectedSeason: {
                name: 'none'
            },
            selectedGameDate: '',
            selectedTemplate: {
                name: 'default',
                tags: []
            }
        };
        $scope.showEditProjectDialog = function () {
            // set the values here:
            $scope.editCurrentProject.selectedCategory = $scope.currentProjectConfiguration.selectedCategory;
            $scope.editCurrentProject.selectedTeam = $scope.currentProjectConfiguration.selectedTeam;
            $scope.editCurrentProject.selectedSeason = $scope.currentProjectConfiguration.selectedSeason;
            $scope.editCurrentProject.selectedGameDate = $scope.currentProjectConfiguration.selectedGameDate;
            $scope.editCurrentProject.selectedTemplate = $scope.currentProjectConfiguration.selectedTemplate;
            $('#editProjectDetails').dialog('open');
        };
        $scope.manageTemplates = {
            templateToAdd: {
                name: '',
                tags: []
            },
            addTemplate: function () {
                if ($scope.manageTemplates.templateToAdd && $scope.manageTemplates.templateToAdd.name && $scope.manageTemplates.templateToAdd.name.length > 0) {
                    $scope.user.tagTemplateList[$scope.user.tagTemplateList.length] = $scope.manageTemplates.templateToAdd;
                    $scope.manageTemplates.templateToAdd = {
                        name: '',
                        tags: []
                    };
                }
            },
            removeTemplate: function (index) {
                $scope.user.tagTemplateList.splice(index, 1);
            },
            selectTemplate: function (index) {
                $scope.currentProjectConfiguration.selectedTemplate = $scope.user.tagTemplateList[index];
            }
        };
        $scope.manageTags = {
            tagToAdd: {
                name: '',
                before: 1,
                after: 1
            },
            addTag: function () {
                if ($scope.manageTags.tagToAdd && $scope.manageTags.tagToAdd.name && $scope.manageTags.tagToAdd.name.length > 0) {
                    $scope.currentProjectConfiguration.selectedTemplate.tags[$scope.currentProjectConfiguration.selectedTemplate.tags.length] = $scope.manageTags.tagToAdd;
                }
                $scope.manageTags.tagToAdd = {
                    name: '',
                    before: 1,
                    after: 1
                };
            },
            removeTag: function (index) {
                $scope.currentProjectConfiguration.selectedTemplate.tags.splice(index, 1);
            }
        };
        $scope.showAddTagDialog = function () {
            $('#createNewTag').dialog('open');
        };
        $scope.manageCategories = {
            categoryToAdd: {
                name: ''
            },
            categoryList: [],
            addCategory: function () {
                if ($scope.manageCategories.categoryToAdd && $scope.manageCategories.categoryToAdd.name && $scope.manageCategories.categoryToAdd.name.length > 0) {
                    $scope.manageCategories.categoryList[$scope.manageCategories.categoryList.length] = $scope.manageCategories.categoryToAdd;
                    $scope.manageCategories.categoryToAdd = {
                        name: ''
                    };
                }
            },
            removeCategory: function (index) {
                $scope.manageCategories.categoryList.splice(index, 1);
            }
        };
        $scope.showManageCategoriesDialog = function () {
            $scope.manageCategories.categoryToAdd = {
                name: ''
            };
            $('#configureCategories').dialog('open');
        };
        $scope.manageTeams = {
            teamToAdd: {
                name: ''
            },
            teamList: [],
            addTeam: function () {
                if ($scope.manageTeams.teamToAdd && $scope.manageTeams.teamToAdd.name && $scope.manageTeams.teamToAdd.name.length > 0) {
                    $scope.manageTeams.teamList[$scope.manageTeams.teamList.length] = $scope.manageTeams.teamToAdd;
                    $scope.manageTeams.teamToAdd = {
                        name: ''
                    };
                }
            },
            removeTeam: function (index) {
                $scope.manageTeams.teamList.splice(index, 1);
            }
        };
        $scope.showManageTeamsDialog = function () {
            $scope.manageTeams.teamToAdd = {
                name: ''
            };
            $('#configureTeams').dialog('open');
        };
        $scope.manageSeasons = {
            seasonToAdd: {
                name: ''
            },
            seasonList: [],
            addSeason: function () {
                if ($scope.manageSeasons.seasonToAdd && $scope.manageSeasons.seasonToAdd.name && $scope.manageSeasons.seasonToAdd.name.length > 0) {
                    $scope.manageSeasons.seasonList[$scope.manageSeasons.seasonList.length] = $scope.manageSeasons.seasonToAdd;
                    $scope.manageSeasons.seasonToAdd = {
                        name: ''
                    };
                }
            },
            removeSeason: function (index) {
                $scope.manageSeasons.seasonList.splice(index, 1);
            }
        };
        $scope.showManageSeasonsDialog = function () {
            $scope.manageSeasons.seasonToAdd = {
                name: ''
            };
            $('#configureSeasons').dialog('open');
        };
        // Tagline functionality
        $scope.addTagToTagLine = function (tagID) {
            if ($scope.play) {
                // only add if currently playing
                var elementToAdd = angular.element('#' + tagID);
                var l = $scope.currentProjectConfiguration.tags.length;
                var time = $scope.timestamp;
                $scope.currentProjectConfiguration.tags[l] = {
                    id: 'tag_' + l + '_' + time,
                    time: time,
                    name: elementToAdd.data('tagname'),
                    before: elementToAdd.data('beforetag'),
                    after: elementToAdd.data('aftertag')
                };
            }
        };
        // JQUERY UI
        $(document).ready(function () {
            // Or from within a configuration:
//            Dropzone.options.dropZone = {
//                init: function () {
//                    this.on('success', function (file) {
//                        console.log('uploaded file successfully[' + file.name + ']');
//                        $('#videoPlayer').children().remove();
//                        var playerInstance = jwplayer("videoPlayer").setup({
//                            file: 'upload/' + file.name,
//                            width: 640,
//                            height: 480
//                        });
//                        playerInstance.onReady(function () {
//                            console.log('initializing playback functions');
//                            playerInstance.onPlay(function () {
//                                console.log('play started');
//                                $scope.play = true;
//                            });
//                            playerInstance.onBuffer(function () {
//                                $scope.play = false;
//                                console.log('buffering');
//                            });
//                            playerInstance.onPause(function () {
//                                $scope.play = false;
//                                console.log('player paused');
//                            });
//                            playerInstance.onComplete(function () {
//                                $scope.play = false;
//                                console.log('play completed');
//                            });
//                        });
//
//                        $('#uploadArea').css('display', 'none');
//                        $('#videoPlayer').css('display', 'block');
//                    });
//                },
//                accept: function (file, done) {
//                    var indexMP4 = file.name.indexOf('.mp4');
//                    var length = file.name.length;
//                    if (indexMP4 > 0 && indexMP4 === length - 4) {
//                        done();
//                    } else {
//                        done('Invalid file type, please ensure file is .mp4.');
//                    }
//                }
//            };
            // DIALOG CODE
            // --- input forms :
//            $("#configureCategories").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Save: function () {
//                        // SAVE DATA HERE
//                        $scope.user.categoryList = new Array($scope.manageCategories.categoryList.length);
//                        for (var i = 0; i < $scope.manageCategories.categoryList.length; i++) {
//                            var categoryToAdd = $scope.manageCategories.categoryList[i];
//                            $scope.user.categoryList[i] = categoryToAdd;
//                        }
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#configureTeams").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Save: function () {
//                        // SAVE DATA HERE
//                        $scope.user.teamList = new Array($scope.manageTeams.teamList.length);
//                        for (var i = 0; i < $scope.manageTeams.teamList.length; i++) {
//                            var teamToAdd = $scope.manageTeams.teamList[i];
//                            $scope.user.teamList[i] = teamToAdd;
//                        }
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#configureSeasons").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Save: function () {
//                        // SAVE DATA HERE
//                        $scope.user.seasonList = new Array($scope.manageSeasons.seasonList.length);
//                        for (var i = 0; i < $scope.manageSeasons.seasonList.length; i++) {
//                            var seasonToAdd = $scope.manageSeasons.seasonList[i];
//                            $scope.user.seasonList[i] = seasonToAdd;
//                        }
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#createNewTemplate").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Create: function() {
//                        // SAVE DATA HERE
//                        $scope.user.templateList = new Array($scope.manageTemplates.templateList.length);
//                        for (var i = 0; i < $scope.manageTemplates.templateList.length; i++) {
//                            var templateToAdd = $scope.manageTemplates.templateList[i];
//                            $scope.user.templateList[i] = templateToAdd;
//                        }
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function() {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#createNewTag").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Cancel: function () {
//                        $scope.manageTagCreation.tagToAdd = {
//                            name: '',
//                            before: 0,
//                            after: 0
//                        };
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Add: function () {
//                        // SAVE DATA HERE
//                        $scope.manageTags.addTag();
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#editProjectDetails").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                open: function (event, ui) {
//                    $scope.editCurrentProject = {
//                        selectedCategory: $scope.currentProjectConfiguration.selectedCategory,
//                        selectedTeam: $scope.currentProjectConfiguration.selectedTeam,
//                        selectedSeason: $scope.currentProjectConfiguration.selectedSeason,
//                        selectedGameDate: $scope.currentProjectConfiguration.selectedGameDate,
//                        defaultTemplate: $scope.currentProjectConfiguration.defaultTemplate
//                    };
//                },
//                buttons: {
//                    Save: function () {
//                        // SAVE DATA HERE
//                        if ($scope.editCurrentProject.selectedCategory && $scope.editCurrentProject.selectedCategory.name && $scope.editCurrentProject.selectedCategory.name.length > 0 &&
//                                $scope.editCurrentProject.selectedTeam && $scope.editCurrentProject.selectedTeam.name && $scope.editCurrentProject.selectedTeam.name.length > 0 &&
//                                $scope.editCurrentProject.selectedSeason && $scope.editCurrentProject.selectedSeason.name && $scope.editCurrentProject.selectedSeason.name.length > 0 &&
//                                $scope.editCurrentProject.defaultTemplate && $scope.editCurrentProject.defaultTemplate.name && $scope.editCurrentProject.defaultTemplate.name.length > 0) {
//                            $scope.currentProjectConfiguration.selectedCategory = $scope.editCurrentProject.selectedCategory;
//                            $scope.currentProjectConfiguration.selectedTeam = $scope.editCurrentProject.selectedTeam;
//                            $scope.currentProjectConfiguration.selectedSeason = $scope.editCurrentProject.selectedSeason;
//                            $scope.currentProjectConfiguration.defaultTemplate = $scope.editCurrentProject.defaultTemplate;
//                            $scope.currentProjectConfiguration.selectedGameDate = $scope.editCurrentProject.selectedGameDate;
//                            $(this).dialog("close");
//                            $scope.editCurrentProject = {
//                                selectedCategory: $scope.user.categoryList[0],
//                                selectedTeam: $scope.user.teamList[0],
//                                selectedSeason: $scope.user.seasonList[0],
//                                selectedGameDate: '',
//                                defaultTemplate: $scope.user.tagTemplateList[0]
//                            };
//                        } else {
//                            // highlight incorrect fields
//                        }
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.editCurrentProject = {
//                            selectedCategory: $scope.user.categoryList[0],
//                            selectedTeam: $scope.user.teamList[0],
//                            selectedSeason: $scope.user.seasonList[0],
//                            selectedGameDate: '',
//                            defaultTemplate: $scope.user.tagTemplateList[0]
//                        };
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#newProjectDetails").dialog({
//                autoOpen: true,
//                dialogClass: "no-close",
//                closeOnEscape: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Create: function () {
//                        // SAVE DATA HERE
//                        if ($scope.newProject.name && $scope.newProject.name.length > 0 &&
//                                $scope.newProject.selectedCategory && $scope.newProject.selectedCategory.name && $scope.newProject.selectedCategory.name.length > 0 &&
//                                $scope.newProject.selectedTeam && $scope.newProject.selectedTeam.name && $scope.newProject.selectedTeam.name.length > 0 &&
//                                $scope.newProject.selectedSeason && $scope.newProject.selectedSeason.name && $scope.newProject.selectedSeason.name.length > 0 &&
//                                $scope.newProject.defaultTemplate && $scope.newProject.defaultTemplate.name && $scope.newProject.defaultTemplate.name.length > 0) {
//                            $scope.currentProjectConfiguration.name = $scope.newProject.name;
//                            $scope.currentProjectConfiguration.id = $scope.replaceAll($scope.newProject.name, ' ', '_');
//                            $scope.currentProjectConfiguration.selectedCategory = $scope.newProject.selectedCategory;
//                            $scope.currentProjectConfiguration.selectedTeam = $scope.newProject.selectedTeam;
//                            $scope.currentProjectConfiguration.selectedSeason = $scope.newProject.selectedSeason;
//                            $scope.currentProjectConfiguration.defaultTemplate = $scope.newProject.defaultTemplate;
//                            $scope.currentProjectConfiguration.selectedTemplate = $scope.currentProjectConfiguration.defaultTemplate;
//                            $scope.currentProjectConfiguration.selectedGameDate = $scope.newProject.selectedGameDate;
//                            $(this).dialog("close");
//                            $scope.newProject = {
//                                name: '',
//                                selectedCategory: $scope.user.categoryList[0],
//                                selectedTeam: $scope.user.teamList[0],
//                                selectedSeason: $scope.user.seasonList[0],
//                                selectedGameDate: '',
//                                defaultTemplate: $scope.user.tagTemplateList[0]
//                            };
//                        } else {
//                            // highlight incorrect fields
//                        }
//                        $scope.$apply();
//                    }
//                }
//            });
//            // --- date pickers for the dialogs above
//            $(".gameDate").datepicker({
//                changeMonth: true,
//                changeYear: true,
//                showOn: "button",
//                buttonImage: "img/calendar.gif",
//                buttonImageOnly: true
//            });
//            // --- deletion confirmations :
//            $("#confirmDeleteTemplate").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#confirmDeleteTag").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#confirmDeleteCategory").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#confirmDeleteTeam").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#confirmDeleteSeason").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
//            $("#confirmDeleteProject").dialog({
//                autoOpen: false,
//                resizable: false,
//                modal: true,
//                buttons: {
//                    Confirm: function () {
//                        // DELETE HERE
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    },
//                    Cancel: function () {
//                        $(this).dialog("close");
//                        $scope.$apply();
//                    }
//                }
//            });
        }); // on document ready
    }]);



