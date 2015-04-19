/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.factory('vormInvoke', [ '$injector', '$parse', function ( $injector, $parse ) {
			
			function invoke ( invokable, locals ) {
				let value;
				
				if(!invokable) {
					return invokable;
				}
				
				if((_.isArray(invokable) && typeof _.last(invokable) === 'function') || invokable.$inject !== undefined) {
					value = $injector.invoke(invokable, null, locals ? angular.copy(locals) : null);
				} else if(typeof invokable === 'function') {
					value = invokable();
				} else {
					value = invokable;
				}
				
				return value;
			}
			
			let invoker = function ( invokable, locals ) {
				return invoke(invokable,locals);
			};
			
			invoker.expr = function ( invokable, locals, scope ) {
				let value;
				if(typeof invokable === 'string') {
					value = $parse(invokable)(scope, locals);
				} else {
					value = invoke(invokable, locals);
				}
				return value;
			};
			
			return invoker;
			
		}]);
	
})();
