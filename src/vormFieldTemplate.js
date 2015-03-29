/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldTemplate', [ 'vormTemplateService', 'VormValueType', 'VormModelListCtrl', 'vormInvoke', function ( vormTemplateService, VormValueType, VormModelListCtrl, vormInvoke ) {
			
			return {
				restrict: 'E',
				require: [ 'vormFieldTemplate', 'vormField', '^?vormForm' ],
				template: function ( ) {
					var wrapperEl = angular.element(vormTemplateService.getDefaultWrapper()),
						templateEl = angular.element(vormTemplateService.getDefaultTemplate());
					
					angular.element(wrapperEl[0].querySelectorAll('[ng-transclude], ng-transclude')).replaceWith(templateEl);
					
					return wrapperEl[0].outerHTML;
				},
				replace: true,
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					const ctrl = this,
						vormModelList = new VormModelListCtrl(),
						inputs = [];

					let config = $scope.$eval($attrs.config) || {},
						compiler,
						vormField,
						vormForm;
					
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
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						vormForm = controllers[1];
						
						vormField.setName(config.name);
						
						if(config.limit > 1) {
							vormField.setValueType(VormValueType.LIST);
						}
						
						vormField.setRequired(config.required || false);
						
						vormModelList.addDelegate();
					};
					
					ctrl.getLabel = function ( ) {
						return config.label;	
					};
					
					ctrl.getModelCompiler = function ( ) {
						return compiler;
					};
					
					ctrl.getInputData = function ( ) {
						return config.data;	
					};
					
					ctrl.getInvokedData = function ( key ) {
						let values;
						
						if(vormForm) {
							values = vormForm.getValues();
						} else {
							values = {};
							values[vormField.getName()] = vormField.getValue();
						}
						
						return vormInvoke(ctrl.getInputData()[key], {
							$values: values
						});
					};
					
					ctrl.addInput = function ( input ) {
						inputs.push(input);
					};
					
					ctrl.removeInput = function ( input ) {
						_.pull(inputs, input);	
					};
					
					ctrl.getInputs = function ( ) {
						return inputs;	
					};
					
					ctrl.getLastInputId = function ( ) {
						var input = _.last(inputs),
							inputId;
							
						if(input) {
							inputId = input.getInputId();
						}
						
						return inputId;
					};
					
					ctrl.getDelegates = vormModelList.getDelegates;
					ctrl.addDelegate = vormModelList.addDelegate;
					ctrl.clearDelegate = vormModelList.clearDelegate;
					
				}],
				controllerAs: 'vormFieldTemplate',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
				}
			};
			
		}]);
	
})();
