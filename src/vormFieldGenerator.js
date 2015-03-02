/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldGenerator', [ 'vormTemplateService', function ( vormTemplateService ) {
			
			return {
				require: [ 'vormFieldGenerator' ],
				template: function ( ) {
					return vormTemplateService.getDefaultTemplate();
				},
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					var ctrl = this,
						config = $scope.$eval($attrs.config) || {},
						template;
					
					config = _.extend(config, { 
						name: $attrs.name,
						type: $attrs.type,
						label: $attrs.label,
						template: $scope.$eval($attrs.label)
					});
					
					if(!config.name || !config.type) {
						throw new Error('Missing one of required arguments: name, type ');
					}
					
					template = vormTemplateService.getModelTemplate(config.type, config.template);
					
					ctrl.getInputTemplate = function ( ) {
						return template;
					};
					
					return ctrl;
					
				}],
				controllerAs: 'vormFieldGenerator'
			};
			
		}]);
	
})();
