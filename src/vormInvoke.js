/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('vormInvoke', [ '$injector', function ( $injector ) {
			
			return function ( invokable, locals ) {
				
				var value;
				
				if(!invokable) {
					return invokable;
				}
				
				if((_.isArray(invokable) && typeof _.last(invokable) === 'function') || invokable.$inject !== undefined) {
					value = $injector.invoke(invokable, null, angular.copy(locals));
				} else if(typeof invokable === 'function') {
					value = invokable();
				} else {
					value = invokable;
				}
				
				return value;
			}
			
		}]);
	
})();
