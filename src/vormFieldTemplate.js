/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldTemplate', [ 'vormTemplateService', 'VormValueType', 'VormModelListCtrl', function ( vormTemplateService, VormValueType, VormModelListCtrl ) {
			
			var el = angular.element(`
				<ul class="vorm-input-list">
					<li class="vorm-input-list-item" ng-repeat="model in vormFieldTemplate.getDelegates()">
						<vorm-input model="model" compiler="vormFieldTemplate.getModelCompiler()" data="vormFieldTemplate.getInputData()"></vorm-input>
					</li>
				</ul>
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
					
					const ctrl = this;

					let config = $scope.$eval($attrs.config) || {},
						compiler,
						vormField,
						vormModelList = new VormModelListCtrl();
					
					config = _.defaults(angular.copy(config), { 
						name: $attrs.name,
						type: $attrs.type,
						label: $attrs.label,
						template: $scope.$eval($attrs.label)
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
					
					ctrl.getDelegates = vormModelList.getDelegates;
					ctrl.addDelegate = vormModelList.createDelegate;
					ctrl.clearDelegate = vormModelList.clearDelegate;
					
				}],
				controllerAs: 'vormFieldTemplate',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
				}
			};
			
		}]);
	
})();
