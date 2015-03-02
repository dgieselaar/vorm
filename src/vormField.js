/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormField', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
			
			return {
				scope: true,
				require: [ 'vormField', '^?vormForm' ],
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
					
					var name = $scope.$eval($attrs.vormField) || $attrs.ngModel;
					
					angular.extend(this, new VormFieldCtrl(name));
					
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
