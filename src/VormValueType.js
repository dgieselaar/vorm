import angular from 'angular';

angular.module('vorm')
	.constant('VormValueType', {
		SINGLE: 'single',
		LIST: 'list',
		NAMED: 'named'
	});
