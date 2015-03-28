/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldTemplate', [ 'vormTemplateService', 'VormValueType', 'VormModelListCtrl', function ( vormTemplateService, VormValueType, VormModelListCtrl ) {
			
			var el = angular.element(`
				<div class="vorm-input-list">
					<div class="vorm-input-list-item" ng-repeat="delegate in vormFieldTemplate.getDelegates()">
						<vorm-input delegate="delegate" compiler="vormFieldTemplate.getModelCompiler()" data="vormFieldTemplate.getInputData()"></vorm-input>
						<button type="button" ng-click="vormFieldTemplate.clearDelegate(delegate)" ng-show="vormField.getValueType()==='multiple'">x</button>
					</div>
				</div>
			`);
			
			return {
				restrict: 'E',
				require: [ 'vormFieldTemplate', 'vormField' ],
				template: function ( ) {
					var element = angular.element(vormTemplateService.getDefaultTemplate());
					
					angular.element(element[0].querySelectorAll('[ng-transclude], ng-transclude')).replaceWith(el);
					
					return element[0].outerHTML;
				},
				replace: true,
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					const ctrl = this,
						vormModelList = new VormModelListCtrl(),
						inputs = [];

					let config = $scope.$eval($attrs.config) || {},
						compiler,
						vormField;
					
					config = _.defaults(angular.copy(config), { 
						name: $attrs.name,
						type: $attrs.type,
						label: $attrs.label,
						template: $scope.$eval($attrs.template),
						data: $scope.$eval($attrs.data)
					});
					
					if(!config.name || !config.type) {
						throw new Error('Missing one of required arguments: name, type ');
					}
										
					compiler = vormTemplateService.getModelCompiler(config.type, config.modelTemplate);
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						
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
