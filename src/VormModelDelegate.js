/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('VormModelDelegate', [ 'VormModelDelegateCtrl', function ( VormModelDelegateCtrl ) {
			
			return {
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					var ctrl = this,
						delegate = $scope.$eval($attrs.delegate);
						
					if(!delegate) {
						delegate = new VormModelDelegateCtrl();
					}
					
					ctrl.setNgModel = delegate.setNgModel;
					
				}]
			};
			
		}]);
	
})();
