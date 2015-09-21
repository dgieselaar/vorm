import angular from 'angular';

angular.module('vorm')
	.directive('vormLabel', [ function ( ) {
		
		return {
			require: [ 'vormLabel', '^vormFieldConfig', '^vormFocusableList' ],
			template: '<label class="vorm-field-label">{{vormLabel.getLabel()}}</label>',
			replace: true,
			controller: [ '$scope', '$element', function ( $scope, $element ) {
				
				let ctrl = this,
					vormFieldConfig,
					vormFocusableList;
				
				ctrl.link = function ( controllers ) {
					vormFieldConfig = controllers[0];
					vormFocusableList = controllers[1];
					
					$scope.$watch(vormFocusableList.getId, function ( inputId ) {
						$element.attr('for', inputId);
					});
				};
				
				ctrl.getLabel = function ( ) {
					return vormFieldConfig.invoke(vormFieldConfig.getConfig().label);
				};
				
			}],
			controllerAs: 'vormLabel',
			link: function ( scope, element, attrs, controllers ) {
				
				controllers[0].link(controllers.slice(1));
				
			}
		};
		
	}]);

