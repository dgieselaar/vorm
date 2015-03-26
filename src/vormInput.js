/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormInput', [ function ( ) { 
			
			return {
				require: [ 'vormInput', '^vormField' ],
				scope: {
					compiler: '&',
					model: '=',
					data: '&'
				},
				controller: [ function ( ) {
					
					var ctrl = this,
						vormField;
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
					};
					
					ctrl.isRequired = function ( ) {
						return vormField && vormField.isRequired();	
					};
					
				}],
				controllerAs: 'vormInput',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
					
					scope.compiler()(scope, function ( clonedElement ) {
						element.replaceWith(clonedElement);
					});
				}
			};
			
			
		}]);
	
})();
