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
							$scope.$watch(ctrl.invoke.bind(config.required), function ( isRequired ) {
								vormField.setRequired(!!isRequired);
							});
						} else {
							vormField.setRequired(config.required || false);
						}
					};
					
					ctrl.invoke = function ( invokable ) {
						let values;
						
						if(vormForm) {
							values = vormForm.getValues();
						} else if(vormField) {
							values = {};
							values[vormField.getName()] = vormField.getValue();
						}
						
						return vormInvoke(invokable, {
							$values: values
						});
					};
					
					ctrl.getConfig = function ( ) {
						return config;	
					};
					
					ctrl.getData = function ( ) {
						return config.data;	
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
					
				}],
				link: function ( scope, element, attrs, controllers ) {
					controllers[0].link(controllers.slice(1));
				}
				
			};
			
		}]);
	
})();
