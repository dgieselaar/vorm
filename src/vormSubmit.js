/*global angular*/
(function ( ) { 
	
	angular.module('vorm')
		.directive('vormChange', [ '$parse', function ( $parse ) {
			
			return {
				require: [ 'vorm' ],
				link: function ( scope, element, attrs, controllers ) {
					
					var [ vorm ] = controllers,
						cb;
					
					if(!attrs.vormSubmit) {
						return;
					}
					
					function handleSubmit ( ) {
						cb(scope, {
							$values: vorm.getValues()
						});
					}
					
					
					cb = $parse(attrs.vormSubmit);
					vorm.changeListeners.push(handleSubmit);
					
				}
			};
			
		}]);
})();
