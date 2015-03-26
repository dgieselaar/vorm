/*global angular*/
(function ( ) { 
	
	angular.module('vorm')
		.directive('vormSubmit', [ '$parse', function ( $parse ) {
			
			return {
				require: [ 'vormForm' ],
				link: function ( scope, element, attrs, controllers ) {
					
					const [ vorm ] = controllers;
					let cb;
					
					function handleSubmit ( ) {
						cb(scope, {
							$values: vorm.getValues()
						});
					}
					
					cb = $parse(attrs.vormSubmit);
					
					element.bind('submit', handleSubmit);
					
				}
			};
			
		}]);
})();
