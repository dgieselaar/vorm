/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormControl', [ '$document', function ( $document ) { 
			
			let matchesFuncName = (function ( ) {
				
				let element = $document[0].createElement('div');
				
				return _([ '', 'ms', 'moz', 'webkit'])
					.map(function ( prefix ) {
						return (prefix ? (prefix + 'MatchesSelector') : 'matches');
					})
					.find(function ( name ) {
						return name in element;
					});
			})();
			
			
			return {
				restrict: 'E',
				require: [ 'vormControl', '^vormField', '^vormFieldConfig', '^vormFocusableList', '^vormFieldTemplate' ],
				controller: [ '$scope', '$element', '$attrs', function ( $scope, $element, $attrs ) {
					
					var ctrl = this,
						vormField,
						vormFieldConfig,
						vormFocusableList,
						vormFieldTemplate,
						inputId = Math.random().toString(36).slice(2);
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						vormFieldConfig = controllers[1];
						vormFocusableList = controllers[2];
						vormFieldTemplate = controllers[3];
						
						ctrl.invokeData = vormFieldConfig.invokeData;
						ctrl.getData = vormFieldConfig.getData;
						ctrl.getConfig = vormFieldConfig.getConfig;
						
						vormFocusableList.addId(inputId);
						
						vormFieldTemplate.getModelCompiler()($scope, function ( clonedElement ) {
							
							let focusable,
								selector = 'input,keygen,meter,output,progress,select,textarea',
								replace = $element.find('vorm-control-replace'),
								delegate = $scope.$eval($attrs.delegate);
							
							replace.replaceWith(clonedElement);
							
							clonedElement[0].className += ' ' + replace[0].className;
							
							if(clonedElement[0][matchesFuncName](selector)) {
								focusable = clonedElement;
							} else {
								focusable = angular.element(clonedElement[0].querySelector(selector));
							}
							
							focusable.attr('id', ctrl.getInputId());
							
							$scope.$$postDigest(function ( ) {
								delegate.setNgModel(clonedElement.controller('ngModel'));
							});
							
							$scope.$on('$destroy', function ( ) {
								delegate.unsetNgModel();
							});
						});
					};
					
					ctrl.isRequired = function ( ) {
						return vormField && vormField.isRequired();	
					};
					
					ctrl.getInputId = function ( ) {
						return inputId;
					};
					
					ctrl.getViewValue = function ( ) {
						return $scope.$eval($attrs.delegate).getViewValue();	
					};
							
					ctrl.getDisplayMode = function ( ) {
						return vormFieldConfig.getDisplayMode();
					};
					
					if(angular.version.minor >= 4) {
						// dynamic options throws an error in <=1.3.x
						// fixed in 1.4.x
						// https://github.com/angular/angular.js/pull/10639
						ctrl.getOptions = function ( ) {
							return ctrl.invokeData('options');	
						};
					} else {
						ctrl.getOptions = (function ( ) {
							
							let options;
							
							return function ( ) {
								const nwOpts = ctrl.invokeData('options');
								if(options !== nwOpts && !angular.equals(options,nwOpts)) {
									options = nwOpts;
								}
								
								return options;	
							};
						})();
					}
					
					$scope.$on('$destroy', function ( ) {
						vormFocusableList.removeId(inputId);
					});
					
				}],
				controllerAs: 'vormControl',
				link: function ( scope, element, attrs, controllers ) {
					controllers[0].link(controllers.slice(1));
				}
			};
			
			
		}]);
	
})();
