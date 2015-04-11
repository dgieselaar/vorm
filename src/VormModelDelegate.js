/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormModelDelegate', [ function ( ) {
			
			return function ( name ) {
				
				const delegate = {};
				let ngModel;
				
				delegate.value = null;
				
				delegate.getName = function ( ) {
					return name;
				};
				
				delegate.setNgModel = function ( ) {
					ngModel = arguments[0];
				};
				
				delegate.getNgModel = function ( ) {
					return ngModel;	
				};
				
				delegate.clearViewValue = function ( ) {
					ngModel.$setViewValue(null);
					ngModel.$render();
				};
				
				return delegate;
				
			};
			
		}]);
	
})();
