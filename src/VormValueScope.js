import angular from 'angular';
	
angular.module('vorm')
	.factory('VormValueScope', [ '$rootScope', function ( $rootScope ) {
		
		return function ( ) {
			
			const scope = $rootScope.$new();
			
			return scope;
			
		};
		
	}]);
