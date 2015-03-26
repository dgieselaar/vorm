/*global angular*/
(function ( ) { 
	
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
})();
