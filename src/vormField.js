/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormField', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
			
			return {
				scope: true,
				require: [ 'vormField', '^?vormForm' ],
				controller: [ '$scope', '$element', '$attrs', function ( $scope, $element, $attrs ) {
					
					var name = $scope.$eval($attrs.vormField) || $attrs.ngModel;
					
					angular.extend(this, new VormFieldCtrl(name, $element[0]));
					
				}],
				controllerAs: 'vormField',
				link: function ( scope, element, attrs, controllers ) {
					
					var [ vormField, vorm ] = controllers;
					
					if(vorm) {
						vorm.addField(vormField);
						scope.$on('$destroy', function ( ) {
							vorm.removeField(vormField);
						});
					}
					
				}
			};
			
		}]);
	
})();
