/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('ngModel', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
			
			return {
				require: [ 'ngModel', '^?vormField', '^?vormForm' ],
				link: function ( scope, element, attrs, controllers ) {
					
					let [ ngModel, vormField, vorm ] = controllers;
					
					if(vormField || vorm) {
						
						if(!vormField) {
							vormField = new VormFieldCtrl(attrs.name || attrs.ngModel, element[0]);
							
							if(vorm) {
								vorm.addField(vormField);
								scope.$on('$destroy', function ( ) {
									vorm.removeField(vormField);
								});
							}
						}
						
						vormField.addModel(ngModel);
						
						scope.$on('$destroy', function ( ) {
							vormField.removeModel(ngModel);
						});
						
					}
					
				}
			};
			
		}]);
	
})();
