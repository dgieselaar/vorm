/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('ngModel', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
			
			return {
				require: [ 'ngModel', '^?vormField', '^?vormForm' ],
				link: function ( scope, element, attrs, controllers ) {
					
					var [ ngModel, vormField, vorm ] = controllers;
					
					if(!vormField && !vorm) {
						// nothing to see here, move along
						return;
					}
					
					if(!vormField) {
						vormField = new VormFieldCtrl(attrs.ngModel, scope);
						vorm.addField(vormField);
						scope.$on('$destroy', function ( ) {
							vorm.removeField(vormField);
						});
					}
					
					vormField.addModel(ngModel);
					
					scope.$on('$destroy', function ( ) {
						vormField.removeModel(ngModel);
					});
					
				}
			};
			
		}]);
	
})();
