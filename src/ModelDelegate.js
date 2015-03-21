/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('ModelDelegate', [ function ( ) {
			
			return function ( name ) {
				
				var delegate = {};
				
				delegate.value = undefined;
				
				delegate.getName = function ( ) {
					return name;
				};
				
				return delegate;
				
			};
			
		}]);
	
})();
