'use strict';

/* Directives */
angular.module('matchflow.directives', []).
    directive(
        'mfTabs', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div role="tabpanel">TABS</div>',
                link: function(scope,elem,attr) {
                    var windowHeight = angular.element(window).outerHeight();
                    elem.css('minHeight',windowHeight);
                    scope.tabData = [
                        {
                            id: 'tab1',
                            name: 'TAB 1',
                            partial: 'tab1.html'
                        },
                        {
                            id: 'tab2',
                            name: 'TAB 2',
                            partial: 'tab2.html'
                        }
                    ];
                    var tabsNavHtml = '<ul class="nav nav-tabs" role="tablist">';
                    var tabsContentHtml = '<div class="tab-content">';
                    for (var t = 0; t < scope.tabData.length; t++) {
                        var tab = scope.tabData[t];
                        var animationCSS = ' fade';
                        var defaultTab = '';
                        if (t === 0) {
                            animationCSS = ' fade in active';
                            defaultTab = ' class="active"';
                        }
                        tabsNavHtml += '<li id="'+tab.id+'_tab" role="presentation"'+defaultTab+'><a href="#'+tab.id+'" aria-controls="settings" role="tab" data-toggle="tab">'+tab.name+'</a></li>';
                        tabsContentHtml += '<div id="'+tab.id+'" role="tabpanel" class="tab-pane'+animationCSS+'">...</div>';
                    }
                    tabsNavHtml += '</ul>';
                    tabsContentHtml += '</div>';
                    elem.html(tabsNavHtml+tabsContentHtml);
                }
            };
        }
    ).directive(
        'mfNotes', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div></div>',
                link: function(scope,elem,attr) {
                    scope.noteData = [
                        {
                            id: 'note1',
                            name: 'NOTE 1',
                            type: 'standard',
                            action: ''
                        },
                        {
                            id: 'note2',
                            name: 'NOTE 2',
                            type: 'info',
                            action: ''
                        },
                        {
                            id: 'note3',
                            name: 'NOTE 3',
                            type: 'success',
                            action: ''
                        },
                        {
                            id: 'note4',
                            name: 'NOTE 4',
                            type: 'critical',
                            action: ''
                        },
                        {
                            id: 'note5',
                            name: 'NOTE 5',
                            type: 'warning',
                            action: ''
                        }
                    ];
                    var listHtml = '<ul class="mf-notes">';
                    for (var l = 0; l < scope.noteData.length; l++) {
                        var note = scope.noteData[l];
                        listHtml += '<li id="'+note.id+'" class="'+note.type+'">'+note.name+'</li>';
                    }
                    listHtml += '</ul>';
                    elem.html(listHtml);
                }
            };
        }
    ).directive(
        'mfSideBar', function($compile) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    config: '=sideBarConfig'
                },
                template: '<div></div>',
                link: function(scope,elem,attr) {
                    scope.showManagerDialog = scope.config.onclick;
                    var sideBarHtml = '<ul class="side-bar-container nav nav-pills nav-stacked">';
                    for (var t = 0; t < scope.config.data.length; t++) {
                        var tab = scope.config.data[t];
                        sideBarHtml += '<li id="'+tab.id+'" class="side-bar-tab '+tab.id+'" ng-click="showManagerDialog(\''+tab.id+'\');"><div class="rotate90">'+tab.name+'</div></li>';
                    }
                    sideBarHtml += '</ul>';
                    elem.html($compile(sideBarHtml)(scope));
                }
            };
        }
    ).directive('mfEventList', function($compile) {
        return {
            scope: {
                localEventGroupData : '=eventGroupData'
            },
            replace: true,
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, element) {
                scope.$watch(
                    'localEventGroupData',
                    function(newList,oldList) {
                        if (newList !== undefined) {
                            // only update if the length is different between the lists, not for every single edit
                            var content = '<div class="form-inline">'+
                                              '<div class="form-group">'+
                                                  '<input type="text" ng-model="manageEvents.eventGroupToAdd.name" class="form-control" style="width:180px;"/> '+
                                                  '<input type="text" ng-model="manageEvents.eventGroupToAdd.color" class="form-control" style="width:80px;"/> '+
                                                  '<button class="btn btn-sm btn-primary" ng-click="manageEvents.addEventGroup()"><i class="glyphicon small-inverted glyphicon-plus"></i></button>'+
                                              '</div>'+
                                          '</div>';
                            for (var i = 0; i < newList.length; i++) {
                                var eventGroup = newList[i];
                                content += '<div class="form-inline" style="margin-top:5px;">'+
                                               '<div class="form-group" style="width:100%;">'+
                                                   '<mf-event-group event-data="manageEvents.eventGroupMap[\''+eventGroup.name+'\']" event-group-name="'+eventGroup.name+'" event-group-index="'+i+'" event-group-color="'+eventGroup.color+'" />'+
                                               '</div>'+
                                           '</div>';
                            }
                            element.html($compile(content)(scope.$parent));
                        }
                    }, 
                    true
                );
            }
        };
    }).directive('mfEventGroup', function($compile) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                localEventData : '=eventData'
            },
            template: '<div></div>',
            link: function(scope, element, attrs) {
                scope.$watch(
                    'localEventData',
                    function(newData,oldData) {
                        if (newData.eventList !== undefined) {
                            // only update if the length is different between the lists, not for every single edit
                            var eventGroupContent = '<div class="panel-group" role="tablist" aria-multiselectable="true">'+
                                              '<div class="panel panel-default">'+
                                                  '<div class="panel-heading" role="tab" id="'+attrs.eventGroupName+'_heading">'+
                                                      '<h4 class="panel-title" style="position:relative;">'+
                                                          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
                                                              attrs.eventGroupName+
                                                          '</a>'+
                                                          '<a style="position:absolute; right:0px;" ng-click="manageEvents.removeEventGroup('+attrs.eventGroupIndex+')"><i class="glyphicon glyphicon-trash"></i></a>'+
                                                      '</h4>'+
                                                  '</div>'+
                                                  '<div id="'+attrs.eventGroupName+'_collapse" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="'+attrs.eventGroupName+'_heading">'+
                                                      '<div class="form-inline" style="margin-left:10px; margin-top:5px;">'+
                                                          '<div class="form-group">'+
                                                              '<input type="text" placeholder="name" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupName+'\'].eventToAdd.name" class="form-control" style="width:180px;" /> '+
                                                              '<input type="text" placeholder="before" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupName+'\'].eventToAdd.before" class="form-control" style="width:80px;" /> '+
                                                              '<input type="text" placeholder="after" ng-model="manageEvents.eventGroupMap[\''+attrs.eventGroupName+'\'].eventToAdd.after" class="form-control" style="width:80px;" /> '+
                                                              '<button class="btn btn-round btn-sm btn-primary" ng-click="manageEvents.addEventToGroup(\''+attrs.eventGroupName+'\')"><i class="glyphicon small-inverted glyphicon-plus"></i></button>'+
                                                          '</div>'+
                                                      '</div>'+
                                                      '<div class="form-group" style="width:100%; padding-bottom: 5px;">';
                            // now populate the content
                            for (var i = 0; i < newData.eventList.length; i++) {
                                var eventData = newData.eventList[i];
                                eventGroupContent += '<mf-event event-name="'+eventData.name+'" event-index="'+i+'" event-group-name="'+attrs.eventGroupName+'" event-before="'+eventData.before+'" event-after="'+eventData.after+'" event-color="'+attrs.eventGroupColor+'"></mf-event>';
                            }

                            eventGroupContent += '</div>'+ // inline content
                                             '</div>'+ //collapse panel
                                         '</div>'+ // panel
                                     '</div>'; // panel group
                            element.html($compile(eventGroupContent)(scope.$parent));
                            
                        }
                    }, 
                    true
                );
            }
        };
    }).directive('mfEvent', function($compile) {
        return {
            replace: true,
            scope: true,
            restrict: 'E',
            template: '<div class="mf-event draggable"></div>',
            link: function(scope, element, attrs) {
                scope.removeEvent = function() {
                    scope.manageEvents.removeEventFromGroup(attrs.eventGroupName, attrs.eventIndex);
                };
                scope.addEvent = function() {
                    //scope.manageEvents.addEventTagToEventTagLine(scope.id);
                };
                var content = '<div ng-click="addEvent()" class="mf-event-tag" style="background-color:'+attrs.eventColor+';">'+
                                  attrs.eventName+
                                  '<a ng-click="removeEvent()" style="position:absolute; right:10px;">'+
                                      '<i class="glyphicon glyphicon-trash"></i>'+
                                  '</a>'+
                              '</div>';
                element.html($compile(content)(scope));
            }
        };
    }).directive('mfUserProfile', function($compile) {
        return {
            scope: {
                localProfileData : '=profileData'
            },
            replace: true,
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, element) {
                var content = '';
                content += '<div class="dialog-info-text">Basic Info:</div>';
                var basicInfo = [];
                basicInfo[0] = { id:'firstName', label:'First Name' };
                basicInfo[1] = { id:'lastName', label:'Last Name' };
                basicInfo[2] = { id:'email', label:'Email' };
                for (var i = 0; i < basicInfo.length; i++) {
                    var info = basicInfo[i];
                    content += '<div class="input-group">'+
                            '<span class="input-group-addon" id="'+info.id+'Label">'+
                                info.label+
                            '</span>'+
                            '<input type="text" class="form-control" placeholder="'+info.label+'" ng-model="user.'+info.id+'" aria-describedby="'+info.id+'Label">'+
                        '</div>';
                }
                content += '<div class="dialog-info-text">Permissions:</div>';
                content += '<ul class="list-group">';
                for (var i = 0; i < scope.localProfileData.permissions.length; i++) {
                    var permObj = scope.localProfileData.permissions[i];
                    content += '<li class="list-group-item">'+permObj.name+'</li>';
                }
                content += '</ul>';
                element.html($compile(content)(scope.$parent));
            }            
        };
    }).directive('teamList', function($compile) {
        return {
            scope: {
                localTeamList : '=datalist'
            },
            replace: true,
            restrict: 'E',
            link: function(scope, element) {
                scope.$watch(
                    'localTeamList',
                    function(newList,oldList) {
                        if (newList.length === 0 || 
                                oldList && oldList.length !== newList.length) {
                            // only update if the length is different between the lists, not for every single edit
                            element.children().remove();
                            element.append($compile('<table id="teamList"><tr><td><input type="text" ng-model="manageTeams.teamToAdd.name" class="input-modifier" /></td><td><button class="button-modifier" ng-click="manageTeams.addTeam()"><i class="glyphicon small-inverted glyphicon-plus"></i></button></td></tr></table>')(scope.$parent));
                            var tableElement = angular.element('#teamList');
                            var content = '';
                            for (var i = 0; i < newList.length; i++) {
                                content += '<tr><td><input type="text" ng-model="manageTeams.teamList['+i+'].name" class="input-modifier" disabled /></td><td><button ng-click="manageTeams.removeTeam('+i+')"><i class="glyphicon small-inverted glyphicon-trash"></i></button></td></tr>';
                            }
                            tableElement.append($compile(content)(scope.$parent));
                        }
                    }, 
                    true
                );
            },
            template: '<div></div>'
        };
    }).directive('seasonList', function($compile) {
        return {
            scope: {
                localSeasonList : '=datalist'
            },
            replace: true,
            restrict: 'E',
            link: function(scope, element) {
                scope.$watch(
                    'localSeasonList',
                    function(newList,oldList) {
                        if (newList.length === 0 || 
                                oldList && oldList.length !== newList.length) {
                            // only update if the length is different between the lists, not for every single edit
                            element.children().remove();
                            element.append($compile('<table id="seasonList"><tr><td><input type="text" ng-model="manageSeasons.seasonToAdd.name" class="input-modifier" /></td><td><button class="button-modifier" ng-click="manageSeasons.addSeason()"><i class="glyphicon small-inverted glyphicon-plus"></i></button></td></tr></table>')(scope.$parent));
                            var tableElement = angular.element('#seasonList');
                            var content = '';
                            for (var i = 0; i < newList.length; i++) {
                                content += '<tr><td><input type="text" ng-model="manageSeasons.seasonList['+i+'].name" class="input-modifier" disabled /></td><td><button ng-click="manageSeasons.removeSeason('+i+')"><i class="glyphicon small-inverted glyphicon-trash"></i></button></td></tr>';
                            }
                            tableElement.append($compile(content)(scope.$parent));
                        }
                    }, 
                    true
                );
            },
            template: '<div></div>'
        };
    }).directive('templateList', function($compile) {
        return {
            scope: {
                localTemplateList : '=datalist',
                localSelectedTemplate : '=selectedtemplate'
            },
            replace: true,
            restrict: 'E',
            link: function(scope, element, attrs) {
                scope.$watch(
                    '[localTemplateList,localSelectedTemplate]',
                    function(newList,oldList) {
                        if (newList) {
                            element.children().remove();
                            var content = '<table><tr><td><input type="text" ng-model="manageTemplates.templateToAdd.name" class="input-modifier" /></td><td><button class="button-modifier" ng-click="manageTemplates.addTemplate()"><i class="glyphicon small-inverted glyphicon-plus"></i></button></td></tr>';
                            for (var i = 0; i < newList[0].length; i++) {
                                var currentSelected = 'normal-template';
                                if (newList[0] && newList[1] && newList[0][i].name === newList[1].name) {
                                    currentSelected = 'selected-template';
                                }
                                content += '<tr><td colspan="2"><a ng-click="manageTemplates.selectTemplate('+i+')"><div class="'+currentSelected+'"><table class="inner-template-table"><tr><td>'+newList[0][i].name+'</td><td style="width:16px;"><button class="remove-button" ng-click="manageTemplates.removeTemplate('+i+')"><i class="glyphicon small-inverted glyphicon-trash"></i></button></td></tr></table></div></a></td></tr>';
                            }
                            element.append($compile(content+'</table>')(scope.$parent));
                        }
                    }, 
                    true
                );
            },
            template: '<div></div>'
        };
    }).directive('tagLine', function($compile) {
        return {
            scope: {
                timestamp: '=counter',
                tags: '=tagslist',
                moveTagLine: '=playstatus'
            },
            replace: true,
            restrict: 'E',
            link: function(scope, element, attr) {
                scope.start = new Date().getTime()/100;
                scope.end = new Date().getTime()/100+30*60*10;
                scope.offset = 0;
                scope.totalDuration = 30*60*10;
                scope.step = 1;
                scope.currentPosition = 0;
                var toAdd = '';
                for (var i = 0; i < scope.totalDuration; i++) {
                    if (i % 50 === 0) {
                        toAdd += '<div class="time-indicator" style="left:'+i+'px;">'+(i/10)+'</div>';
                    }
                }
                angular.element('#tagContainer').append(toAdd);
                scope.$watch(
                    'timestamp',
                    function(newVal,oldVal) {
                        // need to offset against time to allow for pauses
                        if (newVal <= scope.end && scope.moveTagLine) {
                            if (scope.offset > 0) {
                                var offset = (new Date().getTime()/100) - scope.offset;
                                if (offset > 0) {
                                    scope.start += offset;
                                    scope.end += offset;
                                }
                                scope.offset = 0;
                            }
                            scope.currentPosition = newVal-scope.start;
                        } else {
                            if (scope.offset === 0) {
                                scope.offset = new Date().getTime()/100;
                            }
                        }
                    },
                    true
                );
                scope.$watch(
                    'tags',
                    function(newVal,oldVal) {
                        // append the new tag (always the last one in the list)
                        if (newVal && newVal instanceof Array && scope.start && scope.start > 0) {
                            var newElementToAdd = newVal[newVal.length-1];
                            if (newElementToAdd) {
                                var width = (newElementToAdd.before + newElementToAdd.after)*10;
                                var position = newElementToAdd.time - scope.start;
                                var toAdd = '<div class="draggable-tag" style="left:'+position+'px; width:'+width+'px; margin-left:-'+(newElementToAdd.before*10)+'px;">'+newElementToAdd.name+'</div>';
                                angular.element('#tagContainer').append(toAdd);
                            }
                        }
                    }, 
                    true
                );
            },
            template: '<div class="tag-line-container">' +
                          '<div id="tagContainer" style="position:relative; background-image: url(\'img/positionmarker.png\'); left:50%; width: {{ totalDuration }}px; margin-left: -{{ currentPosition }}px; top:0px; height:80px; background-repeat: repeat-x;"></div>' +
                          '<div style="position:absolute; border:solid 1px #006dcc; width:1px; height:98px; left:406px; top:0px;">' +
                      '</div>'
        };
    }).directive('tagHolder', function($compile) {
        return {
            scope: {
                tagHolder : '=datalist'
            },
            replace: true,
            restrict: 'E',
            link: function(scope, element) {
                scope.$watch(
                    'tagHolder',
                    function(newSelectedTags,oldSelectedTags) {
                        if (newSelectedTags && newSelectedTags.tags && newSelectedTags.tags.length === 0 || oldSelectedTags) {
                            var MAX_COLS = 8;
                            var newList = newSelectedTags.tags;
                            // only update if the length is different between the lists, not for every single edit
                            element.children().remove();
                            element.append($compile('<table cellpadding="5" id="tagHolder"></table>')(scope.$parent));
                            var tableElement = angular.element('#tagHolder');
                            var content = "";
                            var TOTAL_CELLS = newList.length + 1;
                            var EXTRA_COLS = TOTAL_CELLS % MAX_COLS;
                            var TOTAL_FULL_ROWS = (TOTAL_CELLS - EXTRA_COLS) / MAX_COLS;
                            var rowCounter = 0;
                            var colCounter = 0;
                            content += '<tr>';
                            // run through ALL newList elements, and full up rows, if there are extra, they are added into an incomplete row
                            for (var i = 0; i < newList.length; i++) {
                                if (rowCounter < TOTAL_FULL_ROWS && colCounter < MAX_COLS) {
                                    content += '<td><tag name="'+newList[i].name+'" before="'+newList[i].before+'" after="'+newList[i].after+'" index="'+i+'"></tag></td>';
                                    colCounter++;
                                    if (colCounter === MAX_COLS) {
                                        colCounter = 0;
                                        rowCounter++;
                                        content += '</tr>';
                                        if (rowCounter < TOTAL_FULL_ROWS || rowCounter === TOTAL_FULL_ROWS && EXTRA_COLS > 0) {
                                            content += '<tr>';
                                        }
                                    }
                                } else if (rowCounter === TOTAL_FULL_ROWS) {
                                    content += '<td><tag name="'+newList[i].name+'" before="'+newList[i].before+'" after="'+newList[i].after+'" index="'+i+'"></tag></td>';
                                    colCounter++;
                                }
                            }
                            if (EXTRA_COLS > 0) {
                                // need to just full up the extra columns before closing the row
                                content += '<td><button ng-click="showAddTagDialog()">New Tag</button></td>';
                                colCounter++;
                                if (colCounter < MAX_COLS) {
                                    // fill up with empty columns
                                    for (var j = colCounter; j < MAX_COLS; j++) {
                                        content += '<td></td>';
                                    }
                                }
                                // and close this row off
                                content += '</tr>';
                            } else {
                                // add the add tag button here as loop finishes prematurely
                                content += '<td><button ng-click="showAddTagDialog()">New Tag</button></td></tr>';
                            }
                            tableElement.append($compile(content)(scope.$parent));
                        }
                    }, 
                    true
                );
            },
            template: '<div class="tag-holder"></div>'
        };
    });

