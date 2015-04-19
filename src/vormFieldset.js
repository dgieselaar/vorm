/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldset', [ 'vormInvoke', function ( vormInvoke ) {
			
			return {
				restrict: 'E',
				require: [ 'vormFieldset', '^?vormForm' ],
				template: `
					<fieldset>
						<vorm-field-template config="field" ng-repeat="field in vormFieldset.getFields() | filter:vormFieldset.isVisible:field">
						</vorm-field-template>
					</fieldset>
				`,
				replace: true,
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					let ctrl = this,
						vormForm,
						valueScope;
					
					function getValues ( ) {
						let vals = {};
						
						if(vormForm) {
							vals = vormForm.getValues();
						}
						return vals;
					}
					
					ctrl.link = function ( controllers ) {
						vormForm = controllers[0];
						if(vormForm) {
							valueScope = vormForm.getValueScope();
						}
					};
					
					ctrl.getFields = function ( ) {
						return $scope.$eval($attrs.fields);	
					};
					
					ctrl.isVisible = function ( field ) {
						return field.when === null || field.when === undefined ? true : !!vormInvoke.expr(field.when, { $values: getValues() }, valueScope);
					};
					
				}],
				controllerAs: 'vormFieldset',
				link: function ( scope, element, attrs, controllers  ) {
					controllers.shift().link(controllers);
				}
			};
			
		}]);
	
})();
