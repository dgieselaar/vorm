/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('ngModel', [ function ( ) {
			
			return {
				require: [ 'ngModel', '^?vormModel' ],
				link: function ( scope, element, attrs, controllers ) {
					
					let [ ngModel, vormModel ] = controllers;
					
					if(!vormModel) {
						return;
					}
					
					let unset = vormModel.setNgModel(ngModel);
					
					scope.$on('$destroy', function ( ) {
						unset();
					});
					
				}
			};
			
		}]);
	
})();
