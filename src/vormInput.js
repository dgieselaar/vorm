/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormInput', [ function ( ) { 
			
			return {
				require: [ 'vormInput', '^vormField', '^vormFieldTemplate' ],
				controller: [ '$scope', function ( $scope ) {
					
					var ctrl = this,
						vormField,
						vormFieldTemplate,
						inputId = Math.random().toString(36).slice(2);
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						vormFieldTemplate = controllers[1];
						
						ctrl.getInvokedData = vormFieldTemplate.getInvokedData;
						ctrl.getData = vormFieldTemplate.getInputData;
						
						vormFieldTemplate.addInput(ctrl);
					};
					
					ctrl.isRequired = function ( ) {
						return vormField && vormField.isRequired();	
					};
					
					ctrl.getInputId = function ( ) {
						return inputId;
					};
					
					if(angular.version.minor >= 4) {
						// dynamic options throws an error in <=1.3.x
						// fixed in 1.4.x
						// https://github.com/angular/angular.js/pull/10639
						ctrl.getOptions = function ( ) {
							return ctrl.getInvokedData('options');	
						};
					} else {
						ctrl.getOptions = (function ( ) {
							
							let options;
							
							return function ( ) {
								const nwOpts = ctrl.getInvokedData('options');
								if(options !== nwOpts && !angular.equals(options,nwOpts)) {
									options = nwOpts;
								}
								
								return options;	
							};
						})();
					}
					
					$scope.$on('$destroy', function ( ) {
						vormFieldTemplate.removeInput(ctrl);
					});
					
				}],
				controllerAs: 'vormInput',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
					
					scope.$eval(attrs.compiler)(scope, function ( clonedElement ) {
						element.replaceWith(clonedElement);
						
						scope.$$postDigest(function ( ) {
							scope.$eval(attrs.delegate).setNgModel(clonedElement.controller('ngModel'));
						});
					});
				}
			};
			
			
		}]);
	
})();
