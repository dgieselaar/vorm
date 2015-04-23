/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormModelDelegate', [ function ( ) {
			
			return function ( name ) {
				
				const delegate = {};
				let ngModel = null;
				
				delegate.value = null;
				
				delegate.getName = function ( ) {
					return name;
				};
				
				delegate.setNgModel = function ( model ) {
					ngModel = model;
					if(ngModel) {
						ngModel.$name = name;
					}
				};
				
				delegate.unsetNgModel = function ( ) {
					ngModel = null;	
				};
				
				delegate.getNgModel = function ( ) {
					return ngModel;	
				};
				
				delegate.clearViewValue = function ( ) {
					ngModel.$setViewValue(null);
					ngModel.$render();
				};
				
				delegate.getViewValue = function ( ) {
					return ngModel ? ngModel.$viewValue : delegate.value;
				};
				
				return delegate;
				
			};
			
		}]);
	
})();
