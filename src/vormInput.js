/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormInput', [ 'vormInvoke', function ( vormInvoke ) { 
			
			return {
				require: [ 'vormInput', '^vormField', '^vormFieldTemplate', '^?vormForm' ],
				scope: {
					compiler: '&',
					delegate: '=',
					data: '&'
				},
				controller: [ '$scope', function ( $scope ) {
					
					var ctrl = this,
						vormField,
						vormFieldTemplate,
						vormForm,
						inputId = Math.random().toString(36).slice(2);
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						vormFieldTemplate = controllers[1];
						vormForm = controllers[2];
						
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
					
					ctrl.getInvokedData = function ( key ) {
						let values;
						
						if(vormForm) {
							values = vormForm.getValues();
						} else {
							values = {};
							values[vormField.getName()] = vormField.getValue();
						}
						
						return vormInvoke(ctrl.getData()[key], {
							$values: values
						});
					};
					
					ctrl.getData = $scope.data;
					
					$scope.$on('$destroy', function ( ) {
						vormFieldTemplate.removeInput(ctrl);
					});
					
				}],
				controllerAs: 'vormInput',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
					
					scope.compiler()(scope, function ( clonedElement ) {
						element.replaceWith(clonedElement);
						clonedElement.attr('id', controllers[0].getInputId());
						
						scope.$$postDigest(function ( ) {
							scope.delegate.setNgModel(clonedElement.controller('ngModel'));
						});
					});
				}
			};
			
			
		}]);
	
})();
