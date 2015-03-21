/*global angular*/
(function ( ) { 
	
	angular.module('vorm')
		.directive('vormChange', [ '$parse', function ( $parse ) {
			
			return {
				link: function ( scope, element, attrs ) {
					
					var cb;
					
					cb = $parse(attrs.vormChange);
					
					function handleChange ( event, name ) {
						cb(scope, {
							$event: event,
							$name: name
						});
					}
					
					element.bind('viewchange', handleChange);
					
				}
			};
			
		}]);
})();
