'use strict';

/* Directives */
angular.module('matchflow.directives', []).
    directive(
        'mfTabs', function($compile) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    tabs: '=tabData'
                },
                template: '<div role="tabpanel">TABS</div>',
                link: function(scope,elem,attr) {
                    var windowHeight = angular.element(window).outerHeight();
                    elem.css('minHeight',windowHeight);
                    var tabsNavHtml = '<ul class="nav nav-tabs" role="tablist">';
                    var tabsContentHtml = '<div class="tab-content">';
                    for (var t = 0; t < scope.tabs.length; t++) {
                        var tab = scope.tabs[t];
                        var animationCSS = ' fade';
                        var defaultTab = '';
                        if (t === 0) {
                            animationCSS = ' fade in active';
                            defaultTab = ' class="active"';
                        }
                        tabsNavHtml += '<li id="'+tab.id+'_tab" role="presentation"'+defaultTab+'><a href="#'+tab.id+'" aria-controls="settings" role="tab" data-toggle="tab">'+tab.name+'</a></li>';
                        tabsContentHtml += '<div id="'+tab.id+'" role="tabpanel" class="mf-tab-container tab-pane'+animationCSS+'">'+
                            '<mf-tab-feed feed-filter="\''+tab.filter+'\'"></mf-tab-feed>' +
                        '</div>';
                    }
                    tabsNavHtml += '</ul>';
                    tabsContentHtml += '</div>';
                    elem.html($compile(tabsNavHtml+tabsContentHtml)(scope));
                }
            };
        }
    ).directive(
        'mfTabFeed', function($compile) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    filter: '=feedFilter'
                },
                template: '<div class="list-group"></div>',
                link: function(scope,elem,attr) {
                    // TODO infinite scroller
                    // TODO URL feed loader
                    var feedData = [
                        {
                            id: 'post1',
                            title: 'Example Post 1',
                            description: 'This is an example post demonstrating feed data.',
                            link: '#'
                        },
                        {
                            id: 'post2',
                            title: 'Example Post 2',
                            description: 'This is an example post demonstrating feed data.',
                            link: '#'
                        }
                    ];
                    var feedHtml = '';
                    for (var f = 0; f < feedData.length; f++) {
                        var dataItem = feedData[f];
                        feedHtml += '<a href="'+dataItem.link+'" id="'+dataItem.id+'" class="list-group-item">'+
                                '<h4 class="list-group-item-heading">'+dataItem.title+'</h4>'+
                                '<p class="list-group-item-text">'+dataItem.description+'</p>'+
                                '</a>';
                    }
                    elem.html($compile(feedHtml)(scope));
                }
            };
        }
    ).directive(
        'mfNotes', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    notes: '=noteData'
                },
                template: '<div></div>',
                link: function(scope,elem,attr) {
                    var listHtml = '<ul class="mf-notes">';
                    for (var l = 0; l < scope.notes.length; l++) {
                        var note = scope.notes[l];
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
                var content = '' +
                    '<div class="form-inline">'+
                        '<div class="form-group">'+
                            '<input type="text" ng-model="manageEvents.eventGroupToAdd.name" class="form-control" style="width:180px;"/> '+
                            '<input type="text" placeholder="tag color" ng-model="manageEvents.eventGroupToAdd.bgColor" class="form-control" style="width:80px;"/> '+
                            '<input type="text" placeholder="text color" ng-model="manageEvents.eventGroupToAdd.txtColor" class="form-control" style="width:80px;"/> '+
                            '<button class="btn btn-sm btn-primary" ng-click="manageEvents.addEventGroup()"><i class="glyphicon small-inverted glyphicon-plus"></i></button>'+
                        '</div>'+
                    '</div>'+
                    '<div id="eventManagerGroups"></div>';
                element.html($compile(content)(scope.$parent));
                scope.$watch(
                    'localEventGroupData',
                    function(newList,oldList) {
                        if (newList !== undefined && oldList === undefined && newList.length===0 ||
                                newList !== undefined && oldList !== undefined && newList.length !== oldList.length) {
                            // only update if the length is different between the lists, not for every single edit
                            var groupHTML = '';
                            for (var i = 0; i < newList.length; i++) {
                                var eventGroup = newList[i];
                                groupHTML += '<div class="form-inline" style="margin-top:5px;">'+
                                               '<div class="form-group" style="width:100%;">'+
                                                   '<mf-event-group event-data="manageEvents.eventGroupMap[\''+eventGroup.name+'\']" event-group-name="'+eventGroup.name+'" event-group-index="'+i+'" event-group-text-color="'+eventGroup.txtColor+'" event-group-color="'+eventGroup.bgColor+'" />'+
                                               '</div>'+
                                           '</div>';
                            }
                            element.find('#eventManagerGroups').html($compile(groupHTML)(scope.$parent));
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
                // only update if the length is different between the lists, not for every single edit
                scope.eventGroupID = 'event_group_'+attrs.eventGroupName;
                var eventGroupContent = ''+
                    '<div class="panel-group" role="tablist" aria-multiselectable="true">'+
                        '<div class="panel panel-default">'+
                            '<div class="panel-heading" role="tab" id="'+attrs.eventGroupName+'_heading">'+
                                '<h4 class="panel-title" style="position:relative;">'+
                                    '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
                                        attrs.eventGroupName+' (@'+attrs.eventGroupName+')'+
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
                                '<div id="'+scope.eventGroupID+'" class="form-group" style="width:100%; padding-bottom: 5px;">'+
                                '</div>'+ // inline content
                            '</div>'+ //collapse panel
                        '</div>'+ // panel
                    '</div>'; // panel group
                scope.localEventList = scope.localEventData.eventList;
                element.html($compile(eventGroupContent)(scope.$parent));
                scope.$watch(
                    'localEventList',
                    function(newEventList) {
                        if (newEventList !== undefined) {
                            var eventsHTML = '';
                            // now populate the content
                            for (var i = 0; i < newEventList.length; i++) {
                                var eventData = newEventList[i];
                                eventsHTML += '<mf-event event-name="'+eventData.name+'" event-index="'+i+'" event-group-name="'+attrs.eventGroupName+'" event-before="'+eventData.before+'" event-after="'+eventData.after+'"  event-text-color="'+attrs.eventGroupTextColor+'" event-color="'+attrs.eventGroupColor+'"></mf-event>';
                            }
                            element.find('#'+scope.eventGroupID).html($compile(eventsHTML)(scope.$parent));
                            
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
                var content = '<div ng-click="addEvent()" class="mf-event-selector" style="color:'+attrs.eventTextColor+'; background-color:'+attrs.eventColor+';">'+
                                  attrs.eventName+
                                  '<a ng-click="removeEvent()" style="position:absolute; right:10px;">'+
                                      '<i class="glyphicon glyphicon-trash"></i>'+
                                  '</a>'+
                              '</div>';
                element.html($compile(content)(scope));
            }
        };
    }).directive('mfAutocomplete', function($compile) {
        return {
            replace: true,
            scope: {
                labelName: '=label',
                autocompleteData: '=searchData',
                selectedGroups: '=ngModel'
            },
            restrict: 'E',
            template: '<div class="input-group mf-autocomplete-container">'+
                          '<span class="input-group-addon">{{ labelName }}</span>'+
                          '<input type="text" ng-model="searchValue" class="form-control" />'+
                          '<div class="mf-autocomplete-list" style="display:none;"></div>'+
                          '<div class="mf-autocomplete-selection-list">'+
                              '<ul class="mf-selected-list list-group"></ul>'+
                          '</div>'+
                      '</div>',
            link: function(scope, element, attrs) {
                scope.selectedGroupsMap = {};
                scope.searchValue = '';
                scope.updateToggle = false;
                scope.resultSelected = function(selectedName) {
                    // TODO add selected result to the selection box and clear the input area
                    element.find('.mf-autocomplete-list').css('display','none');
                    if (scope.selectedGroupsMap[selectedName] === undefined) {
                        var actualGroup = scope.$parent.newProject.eventGroupMap[selectedName];
                        scope.selectedGroupsMap[selectedName] = scope.selectedGroups.length;
                        scope.selectedGroups[scope.selectedGroups.length] = actualGroup;
                    }
                    scope.searchValue = '';
                };
                scope.removeSelected = function(name) {
                    scope.selectedGroups.splice(scope.selectedGroupsMap[name],1);
                    scope.selectedGroupsMap[name] = undefined;
                    // now run through remainder and update index's
                    for (var s = 0; s < scope.selectedGroups.length; s++) {
                        var group = scope.selectedGroups[s];
                        scope.selectedGroupsMap[group.name] = s;
                    }
                };
                scope.$watch(
                    'searchValue',
                    function(newValue,oldValue) {
                        var searchResults = '<ul class="list-group">';
                        
                        var matchFound = false;
                        for (var i = 0; i < scope.autocompleteData.length; i++) {
                            var result = scope.autocompleteData[i];
                            if (result.name !== undefined && result.name.indexOf(scope.searchValue)>=0) {
                                matchFound = true;
                                searchResults += '<li class="list-group-item"><a ng-click="resultSelected(\''+result.name+'\')"><div class="mf-fully-clickable">'+result.name+'</div></a></li>';
                            }
                        }
                        if (!matchFound) {
                            searchResults += '<li class="list-group-item">no matches found</li>';
                        }
                        
                        searchResults += '</ul>';
                        var width = element.find('input').outerWidth();
                        element.find('.mf-autocomplete-list').html($compile(searchResults)(scope)).css('width',width+'px');
                        if (newValue.length > 0) {
                            element.find('.mf-autocomplete-list').css('display','block');
                        } else {
                            element.find('.mf-autocomplete-list').css('display','none');
                        }
                        
                        
                    }, 
                    true
                );
                scope.$watch(
                    'selectedGroups',
                    function(newValue,oldValue) {
                        var selectedGroups = '';
                        for (var i = 0; i < scope.selectedGroups.length; i++) {
                            var group = scope.selectedGroups[i];
                            var eventNames = '';
                            if (group.eventList.length > 0) {
                                eventNames = group.eventList[0].name;
                                if (group.eventList.length > 1) {
                                    for (var j = 1; j < group.eventList.length; j++) {
                                        eventNames += ', '+group.eventList[j].name;
                                    }
                                }
                            }
                            selectedGroups += '<li class="list-group-item" style="position:relative; color:'+group.txtColor+'; background-color:'+group.bgColor+';">'+group.name+' ['+eventNames+']<a ng-click="removeSelected(\''+group.name+'\')" class="mf-icon-border"><i class="glyphicon glyphicon-trash"></i></a></li>';
                        }
                        element.find('.mf-selected-list').html($compile(selectedGroups)(scope));
                    }, 
                    true
                );
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
    }).directive('mfEventTagLines', function($compile) {
        return {
            scope: {
                timestamp: '=counter',
                tags: '=eventTagLists',
                moveTagLine: '=playStatus'
            },
            template: '<div class="row mf-event-tag-line-container">' +
                          '<div id="tagContainer" class="mf-event-tag-line-markers" style="width: {{ totalDuration }}px; margin-left: -{{ currentPosition }}px;"></div>' +
                          '<div class="mf-time-bar">' +
                      '</div>',
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
            }
        };
    }).directive('mfEventTagArea', function($compile) {
        return {
            scope: {
                localData : '=eventGroupData'
            },
            template: '<div class="container-fluid"></div>',
            replace: true,
            restrict: 'E',
            link: function(scope, element, attrs) {
                scope.$watch(
                    'localData',
                    function(newVal,oldVal) {
                        var contentHTML = '';
                        for (var r = 0; r < scope.localData.length; r++) {
                            contentHTML += '<div class="row mf-event-tag-container">';
                            var group = scope.localData[r];
                            contentHTML += '<div class="mf-event-group-title" style="color:'+group.bgColor+';">'+group.name+'</div>';
                            for (var c = 0; c < group.eventList.length; c++) {
                                var event = group.eventList[c];
                                contentHTML += '<div class="col-lg-2"><div class="mf-event-tag" style="background-color:'+group.bgColor+'; color:'+group.txtColor+';">'+event.name+'</div></div>';
                            }
                            contentHTML += '</div>';
                        }
                        element.append($compile(contentHTML)(scope));
                    },
                    true
                );
            }            
        };
    }).directive('mfVideoPlayer', function($compile) {
        return {
            scope: {
                
            },
            // TODO make this player responsive, change video size for screen
            // we also want nodes, playback touch areas etc
            template: '<div class="row mf-video-player-container"><div id="videoPlayerHolder" class="col-lg-12"></div></div>',
            replace: true,
            restrict: 'E',
            link: function(scope, element, attrs) {
                var contentHTML = 'Video Player';
                
                element.find('#videoPlayerHolder').append($compile(contentHTML)(scope));
            }            
        };
    });

