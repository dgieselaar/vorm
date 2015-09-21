import angular from 'angular';
import _ from 'lodash';

angular.module('vorm')
	.directive('vormFieldTemplate', [ 'vormTemplateService', function ( vormTemplateService ) {
		
		let wrapperEl = angular.element(vormTemplateService.getDefaultTemplate());
		
		angular.element(wrapperEl[0].querySelectorAll('vorm-replace')).replaceWith(vormTemplateService.getDefaultControlTemplate());
		
		wrapperEl.attr('vorm-field-config', 'vormFieldTemplate.getConfig()');
		wrapperEl.attr('vorm-focusable-list', '');
			
		const template = wrapperEl[0].outerHTML;
		
		return {
			scope: true,
			restrict: 'E',
			template: template,
			replace: true,
			controller: [ '$scope', '$attrs', '$element', function ( $scope, $attrs, $element ) {
				
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
				
				$element.attr('vorm-field', config.name);
				
				ctrl.getConfig = function ( ) {
					return config;
				};
				
				ctrl.getModelCompiler = function ( ) {
					return compiler;
				};
				
			}],
			controllerAs: 'vormFieldTemplate'
		};
		
	}]);
