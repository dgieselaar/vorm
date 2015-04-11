/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldTemplate', [ 'vormTemplateService', /*'VormValueType', 'VormModelListCtrl', 'vormInvoke',*/ function ( vormTemplateService/*, VormValueType, VormModelListCtrl, vormInvoke*/ ) {
			
			let wrapperEl = angular.element(vormTemplateService.getDefaultTemplate());
			
			angular.element(wrapperEl[0].querySelectorAll('vorm-replace')).replaceWith(angular.element('<vorm-control-list></vorm-control-list>'));
			
			wrapperEl.attr('vorm-field-config', 'vormFieldTemplate.getConfig()');
			wrapperEl.attr('vorm-focusable-list', '');
				
			const template = wrapperEl[0].outerHTML;
			
			return {
				scope: true,
				restrict: 'E',
				template: template,
				replace: true,
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					let ctrl = this,
						config = $scope.$eval($attrs.config) || {},
						compiler;
					
					config = _.defaults(angular.copy(config), { 
						name: $attrs.name,
						type: $attrs.type,
						label: $attrs.label,
						template: $scope.$eval($attrs.template),
						required: $scope.$eval($attrs.required),
						data: $scope.$eval($attrs.data) || {}
					});
					
					if(!config.name || !config.type) {
						throw new Error('Missing one of required arguments: name, type ');
					}
										
					compiler = vormTemplateService.getModelCompiler(config.type, config.modelTemplate);
					
					ctrl.getConfig = function ( ) {
						return config;	
					};
					
					ctrl.getModelCompiler = function ( ) {
						return compiler;
					};
					
					// ctrl.link = function ( controllers ) {
					// 	vormField = controllers[0];
					// 	vormForm = controllers[1];
						
					// 	vormField.setName(config.name);
						
					// 	if(config.valueType !== undefined) {
					// 		if(typeof config.valueType === 'string') {
					// 			vormField.setValueType(config.valueType);
					// 		} else if(config.valueType.type !== undefined) {
					// 			vormField.setValueType(config.valueType.type);
					// 			if(config.valueType.limit) {
					// 				ctrl.setDelegateLimit(config.valueType.limit);
					// 			}
					// 		}
					// 	}
						
					// 	vormField.setRequired(config.required || false);
						
					// 	vormModelList.addDelegate();
					// };
					
					// ctrl.getLabel = function ( ) {
					// 	return invoke(config.label);
					// };
					// tw
					// ctrl.getAddLabel = function ( ) {
					// 	var invokable = config.valueType && config.valueType.addLabel || '';
					// 	return invoke(invokable);
					// };
					
					// ctrl.getModelCompiler = function ( ) {
					// 	return compiler;
					// };
					
					// ctrl.getInputData = function ( ) {
					// 	return config.data;	
					// };
					
					// ctrl.getInvokedData = function ( key ) {
					// 	return invoke(ctrl.getInputData()[key]);
					// };
					
					// ctrl.addInput = function ( input ) {
					// 	inputs.push(input);
					// };
					
					// ctrl.removeInput = function ( input ) {
					// 	_.pull(inputs, input);	
					// };
					
					// ctrl.getInputs = function ( ) {
					// 	return inputs;	
					// };
					
					// ctrl.getLastInputId = function ( ) {
					// 	var input = _.last(inputs),
					// 		inputId;
							
					// 	if(input) {
					// 		inputId = input.getInputId();
					// 	}
						
					// 	return inputId;
					// };
					
					// ctrl.getDelegates = vormModelList.getDelegates;
					// ctrl.setDelegateLimit = vormModelList.setLimit;
					// ctrl.getDelegateLimit = vormModelList.getLimit;
					// ctrl.reachedDelegateLimit = vormModelList.reachedLimit;
					
					// ctrl.handleDelegateAddClick = function ( ) {
						
					// 	function onModelChange ( ) {
					// 		_.pull(vormField.modelChangeListeners, onModelChange);
					// 		vormField.triggerViewChange();
					// 	}
						
					// 	vormField.modelChangeListeners.push(onModelChange);
					// 	vormModelList.addDelegate();
						
					// };
					
					// ctrl.handleDelegateClearClick = function ( delegate) {
						
					// 	function onModelChange ( ) {
					// 		_.pull(vormField.modelChangeListeners, onModelChange);
					// 		vormField.triggerViewChange();
					// 	}
						
					// 	if(vormModelList.getDelegates().length === 1) {
					// 		vormModelList.clearDelegate(delegate);
					// 	} else {
					// 		vormField.modelChangeListeners.push(onModelChange);
					// 		vormModelList.removeDelegate(delegate);
					// 	}
					// };
					
				}],
				controllerAs: 'vormFieldTemplate',
				link: function ( scope, element, attrs, controllers ) {
					
					// controllers[0].link(controllers.slice(1));
				}
			};
			
		}]);
	
})();
