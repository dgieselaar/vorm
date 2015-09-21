import angular from 'angular';

	/**
	* @ngdoc directive
	* @name ngModel
	* @module vorm
	* @description

	* This overloads the `ngModel` directive, and registers the `ngModelController`
	* with the `vormFieldController` and the `vormFormController` if they're there.
	* __Requires__: `ngModel`, `^?vormField`, `^?vormForm`

	*/
	
angular.module('vorm')
	.directive('ngModel', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
		
		return {
			require: [ 'ngModel', '^?vormField', '^?vormForm' ],
			compile: function ( ) {
				return function link ( scope, element, attrs, controllers ) {
				
					let [ ngModel, vormField, vorm ] = controllers;
					
					if(vormField || vorm) {
					
						if(!vormField) {
							vormField = new VormFieldCtrl(attrs.name || attrs.ngModel, element[0]);
							
							if(vorm) {
								vorm.addField(vormField);
								scope.$on('$destroy', function ( ) {
									vorm.removeField(vormField);
								});
							}
						}
						
						vormField.addModel(ngModel);
						
						scope.$on('$destroy', function ( ) {
							vormField.removeModel(ngModel);
						});
						
					}
				};
			}
		};
		
	}]);
