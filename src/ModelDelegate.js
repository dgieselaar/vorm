/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('ModelDelegate', [ function ( ) {
			
			return function ( name ) {
				
				const delegate = {};
				
				delegate.value = undefined;
				
				delegate.getName = function ( ) {
					return name;
				};
				
				return delegate;
				
			};
			
		}]);
	
})();
