/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldWrapper', [ 'vormTemplateService', function ( vormTemplateService ) {
			
			let wrapped = angular.element(vormTemplateService.getDefaultTemplate());
			
			wrapped.find('vorm-replace').append('<ng-transclude></ng-transclude>');
			
			const template = wrapped[0].outerHTML;
			
			return {
				restrict: 'A',
				transclude: true,
				template: template,
				replace: true,
				controller: [ '$attrs', function ( $attrs ) {
					
					var ctrl = this;
					
					ctrl.getLabel = function ( ) {
						return $attrs.label;	
					};
					
				}]
			};
			
		}]);
	
})();
