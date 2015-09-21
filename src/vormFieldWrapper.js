import angular from 'angular';

angular.module('vorm')
	.directive('vormFieldWrapper', [ 'vormTemplateService', function ( vormTemplateService ) {
		
		let wrapped = angular.element(vormTemplateService.getDefaultTemplate());
		
		wrapped.find('vorm-replace').append('<ng-transclude></ng-transclude>');
		wrapped.attr('vorm-field-config', 'vormFieldWrapper.getConfig()');
		wrapped.attr('vorm-focusable-list', '');
		
		const template = wrapped[0].outerHTML;
		
		return {
			restrict: 'A',
			transclude: true,
			template: template,
			replace: true,
			controller: [ '$attrs', function ( $attrs ) {
				
				var ctrl = this,
					config = {
						name: $attrs.name,
						label: $attrs.label
					};
				
				ctrl.getConfig = function ( ) {
					return config;
				};
				
			}],
			controllerAs: 'vormFieldWrapper'
		};
		
	}]);
