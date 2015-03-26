/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormModelList', [ 'VormModelListCtrl', function ( VormModelListCtrl ) {
			
			return {
				controller: [ function ( ) {
					
					VormModelListCtrl.apply(this, null);
					
				}],
				controllerAs: 'vormModelList'
			};
			
		}]);
	
})();
