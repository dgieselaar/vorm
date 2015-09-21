import angular from 'angular';

angular.module('vorm')
	.config([ 'vormTemplateServiceProvider', function ( vormTemplateServiceProvider ) {
		
		const el = angular.element(`<textarea placeholder="{{vormControl.invokeData('placeholder')}}"></textarea>`);
		
		vormTemplateServiceProvider.registerType('textarea', el);
		
	}]);
