import angular from 'angular';

let moduleName =
	angular.module('vorm', [ ])
		.name;

let context = require.context('./', true, /\.js$/);

context.keys().forEach(context);

export default moduleName;
