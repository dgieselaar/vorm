/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormModelListCtrl', [ 'VormModelDelegate', function ( VormModelDelegate) {
			
			return function ( ) {
				
				const ctrl = this,
					delegates = [];
					
				ctrl.getDelegates = function ( ) {
					return delegates;	
				};
				
				ctrl.clearDelegate = function ( delegate ) {
					if(delegates.length === 1) {
						delegate.clearValue();
					} else {
						_.pull(delegates, delegate);
					}
				};
				
				ctrl.addDelegate = function ( name ) {
					let delegate;
					
					if(!name) {
						name = delegates.length.toString();
					}
					
					delegate = new VormModelDelegate(name);
					delegates.push(delegate);
				};
				
			};
			
		}]);
	
})();
