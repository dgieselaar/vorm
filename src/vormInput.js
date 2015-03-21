/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormInput', [ function ( ) { 
			
			return {
				require: [ '^?vormFieldTemplate' ],
				scope: {
					'modelDelegate': '&',
					'config': '&',
					'type': '&'
				},
				controllerAs: 'vormInput',
				link: function ( scope, element, attrs, controllers, transclude ) {
					
					var [ vormFieldTemplate ] = controllers;
					
					if(vormFieldTemplate) {
						element.replaceWith(vormFieldTemplate.getModelCompiler()(scope));
					} else if(transclude) {
						transclude(function(clone) {
						  	element.replaceWith(clone);
						});
					} else {
						throw new Error('vormInput needs either a transclude function or vormFieldGenerator.');
					}
				}
			};
			
			
		}]);
	
})();
