/*global angular*/
(function ( ) { 
	
	angular.module('vorm')
		.directive('vormChange', [ '$parse', function ( $parse ) {
			
			return {
				require: [ '?vorm', '?vormField' ],
				link: function ( scope, element, attrs, controllers ) {
					
					var [ vorm, vormField ] = controllers,
						cb;
					
					if(!attrs.vormChange) {
						return;
					}
					
					if(!vorm && !vormField) {
						throw new Error('vormChange needs either a vorm or a vormField controller.');
					}
					
					function handleChange ( name, value, before ) {
						cb(scope, {
							$name: name,
							$value: value,
							$before: before
						});
					}
					
					cb = $parse(attrs.vormChange);
					vorm.changeListeners.push(handleChange);
					
				}
			};
			
		}]);
})();
