/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.config([ 'vormTemplateServiceProvider', function ( vormTemplateServiceProvider ) {
			
			const el = angular.element(`<select ng-options="option.value as option.label for option in vormControl.getOptions()"><option value="" ng-show="!!vormControl.invokeData('notSelectedLabel')">{{vormControl.invokeData('notSelectedLabel')}}</option></select>`);
			
			vormTemplateServiceProvider.registerType('select', el);
			
		}]);
	
})();
