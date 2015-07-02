'use strict';

/* App Module */

angular.module('matchflow', ['ngRoute','matchflow.controllers','matchflow.directives']).
    config(
        [
            '$routeProvider', 
            function($routeProvider) {
                $routeProvider.
                    when('/dashboard', {templateUrl: 'partials/dashboard.html',   controller: 'DashboardController'}).
                    when('/analyzer', {templateUrl: 'partials/analyzer.html', controller: 'AnalyzerController'}).
                    otherwise({redirectTo: '/dashboard'});
            }
        ]
    );
