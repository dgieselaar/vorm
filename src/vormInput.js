/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormInput', [ function ( ) { 
			
			return {
				require: [ '^?vormFieldGenerator' ],
				scope: true,
				controllerAs: 'vormInput',
				link: function ( scope, element, attrs, controllers, transclude ) {
					
					var [ vormFieldGenerator ] = controllers;
					
					if(vormFieldGenerator) {
						
						vormFieldGenerator.getInputTemplate()
							.then(function ( compileFunc ) {
								compileFunc(scope, function ( clone ) {
									element.replaceWith(clone);
								});
							})
							.catch(function ( error ) {
								console.log('Error loading input template:', error);
							});
						
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
