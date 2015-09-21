import angular from 'angular';
	
angular.module('vorm')
	.directive('vormDisplay', [ 'vormTemplateService', function ( vormTemplateService ) {
		
		return {
			restrict: 'E',
			require: [ 'vormDisplay', '^vormControl', '^vormFieldConfig' ],
			controller: [ '$scope', '$element', function ( $scope, $element ) {
				
				let ctrl = this,
					vormControl,
					vormFieldConfig;
				
				ctrl.link = function ( controllers ) {
					
					let template,
						compiler,
						config;
					
					vormControl = controllers[0];
					vormFieldConfig = controllers[1];
					
					config = vormFieldConfig.getConfig();
					
					template = config.template ? config.template.display : null;
					
					compiler = vormTemplateService.getDisplayCompiler(config.type, template);
					
					compiler($scope, function ( clonedElement ) {
						$element.append(clonedElement);
					});
					
					ctrl.getViewValue = vormControl.getViewValue;
					ctrl.getModelValue = vormControl.getModelValue;
				};
				
				
			}],
			controllerAs: 'vormDisplay',
			link: function ( scope, element, attrs, controllers ) {
				controllers.shift().link(controllers);
			}
		};
		
	}]);
