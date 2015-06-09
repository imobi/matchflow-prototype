'use strict';

/* Directives */
angular.module('matchflow.directives', []).
    directive(
        'temp', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div></div>',
                link: function(scope,elem,attr) {
                    
                    elem.append('temp');
                }
            };
        }
    );

