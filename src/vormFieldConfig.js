/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldConfig', [ 'vormInvoke', function ( vormInvoke ) {
			
			return {
				require: [ 'vormFieldConfig', 'vormField', '^?vormForm' ],
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					let ctrl = this,
						config = $scope.$eval($attrs.vormFieldConfig),
						vormField,
						vormForm;
						
					function getValues ( ) {
						let values;
						
						if(vormForm) {
							values = vormForm.getValues();
						} else if(vormField) {
							values = {};
							values[vormField.getName()] = vormField.getValue();
						}
						return values;
					}
						
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						vormForm = controllers[1];
												
						vormField.setName(config.name);
						
						if(config.valueType !== undefined) {
							if(typeof config.valueType === 'string') {
								vormField.setValueType(config.valueType);
							} else if(config.valueType.type !== undefined) {
								vormField.setValueType(config.valueType.type);
							}
						}
						
						if(_.isArray(config.required) || typeof config.required === 'function') {
							$scope.$watch(function ( ) {
									return ctrl.invoke(config.required);
								}, function ( isRequired ) {
								vormField.setRequired(!!isRequired);
							});
						} else {
							vormField.setRequired(config.required || false);
						}
						
						if(config.defaults) {
							vormField.setValue(ctrl.invoke(config.defaults));
						}
					};
					
					ctrl.invoke = function ( invokable ) {
						return vormInvoke(invokable, {
							$values: getValues()
						});
					};
					
					ctrl.invokeExpr = function ( invokable ) {
						return vormInvoke.expr(invokable, {
							$values: getValues()
						}, vormField.getValueScope());
					};
					
					ctrl.getConfig = function ( ) {
						return config;	
					};
					
					ctrl.invokeData = function ( key ) {
						return ctrl.invoke(config.data[key]);	
					};
					
					ctrl.getLimit = function ( ) {
						var limit = 1;
						
						if(vormField.getValueType() === 'list') {
							limit = -1;
							
							if(config.valueType && config.valueType.limit !== undefined) {
								limit = ctrl.invoke(config.valueType.limit);
							}
							
						}
						
						return limit;
					};
					
					ctrl.getDisplayMode = function ( ) {
						return ctrl.invokeExpr(config.disabled) ? 'display' : 'edit';
					};
					
				}],
				controllerAs: 'vormFieldConfig',
				link: function ( scope, element, attrs, controllers ) {
					controllers.shift().link(controllers);
				}
				
			};
			
		}]);
	
})();
