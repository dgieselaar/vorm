/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormField', [ 'VormFieldCtrl', function ( VormFieldCtrl ) {
			
			return {
				scope: true,
				require: [ 'vormField', '^?vormForm' ],
				controller: [ '$scope', '$element', '$attrs', function ( $scope, $element, $attrs ) {
					
					const name = $scope.$eval($attrs.vormField) || $attrs.name || $attrs.ngModel,
						ctrl = this;
						
					angular.extend(ctrl, new VormFieldCtrl(name, $element[0]));
					
					ctrl.link = function ( controllers ) {
						const [ vorm ] = controllers;
						
						if(vorm) {
							vorm.addField(ctrl);
							$scope.$on('$destroy', function ( ) {
								vorm.removeField(ctrl);
							});
						}
					};
					
				}],
				controllerAs: 'vormField',
				link: function ( scope, element, attrs, controllers ) {
					controllers.shift().link(controllers);
				}
			};
			
		}]);
	
})();
