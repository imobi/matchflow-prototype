'use strict';

/* Controllers */
angular.module('matchflow.controllers', [])
.controller('MainController', ['$scope', function($scope) {

    // jQuery to collapse the navbar on scroll
    angular.element(window).scroll(function() {
        if (angular.element(".navbar").offset().top > 50) {
            angular.element(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            angular.element(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    angular.element(function() {
        angular.element('a.page-scroll').bind('click', function(event) {
            var $anchor = angular.element(this);
            angular.element('html, body').stop().animate({
                scrollTop: angular.element($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    // Closes the Responsive Menu on Menu Item Click
    angular.element('.navbar-collapse ul li a').click(function() {
        angular.element('.navbar-toggle:visible').click();
    });
    
}]);



