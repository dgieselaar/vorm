/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormModelList', [ 'ModelDelegate', function ( ModelDelegate ) {
			
			return {
				controller: [ function ( ) {
					
					var ctrl = this,
						delegates = [];
					
					ctrl.getDelegates = function ( ) {
						return delegates;	
					};
					
					ctrl.clearDelegate = function ( delegate ) {
						if(delegates.length === 1) {
							delegate.value = undefined;
						} else {
							_.pull(delegates, delegate);
						}
					};
					
					ctrl.addDelegate = function ( name ) {
						var delegate;
						
						if(!name) {
							name = delegates.length.toString();
						}
						
						delegate = new ModelDelegate(name);
						delegates.push(delegate);
					};
				}],
				controllerAs: 'vormModelList'
			};
			
		}]);
	
})();
