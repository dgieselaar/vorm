(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldWrapper', [ 'vormTemplateService', function ( vormTemplateService ) {
			
			return {
				restrict: 'EA',
				transclude: true,
				replace: true,
				template: vormTemplateService.getDefaultWrapper()
			}
			
		}]);
	
})();
