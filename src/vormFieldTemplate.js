/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldTemplate', [ 'vormTemplateService', 'VormValueType', function ( vormTemplateService, VormValueType ) {
			
			return {
				restrict: 'E',
				require: [ 'vormFieldTemplate', 'vormField', 'vormModelList' ],
				template: vormTemplateService.getDefaultTemplate(),
				replace: true,
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					var ctrl = this,
						config = $scope.$eval($attrs.config) || {},
						compiler,
						vormField,
						vormModelList;
					
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
						vormModelList = controllers[1];
						
						vormField.setName(config.name);
						
						if(config.limit > 1) {
							vormField.setValueType(VormValueType.LIST);
						}
						
						vormModelList.addModelDelegate();
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
					
				}],
				controllerAs: 'vormFieldTemplate',
				link: function ( scope, element, attrs, controllers ) {
					controllers[0].link(controllers.slice(1));
				}
			};
			
		}]);
	
})();
