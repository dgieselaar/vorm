import angular from 'angular';
	
/**
 * @ngdoc directive
 * @name vormChange
 * @module vorm
 * @description
 
 Evaluate the given expression when a value changes from the view.
 It listens to a viewchange event, which is dispatched from a
 `vormFieldController` and then bubbles upwards.
 */
	
angular.module('vorm')
	.directive('vormChange', [ '$parse', function ( $parse ) {
		
		return {
			link: function ( scope, element, attrs ) {
				
				const cb = $parse(attrs.vormChange);
				
				function handleChange ( event, name ) {
					cb(scope, {
						$event: event,
						$name: event.detail ? event.detail.name : name
					});
				}
				
				element.bind('viewchange', handleChange);
				
			}
		};
		
	}]);
