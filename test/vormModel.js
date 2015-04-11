/*global angular,_*/
(function ( ) {
	angular.module('vorm')
		.directive('vormModel', [ 'VormModelCtrl', function ( VormModelCtrl ) {
		
			return {
				scope: true,
				require: [ 'vormModel', '^?vormField' ],
				controller: [ '$scope', '$attrs', function ( $scope, $attrs ) {
				
					let ctrl,
						model,
						vormField;
						
					model = $scope.$eval($attrs.vormModel);
					
					if(model) {
						ctrl = {};
						_.extend(ctrl, model);
					} else {
						ctrl = new VormModelCtrl();
					}
					
					ctrl.link = function ( controllers ) {
						vormField = controllers[0];
						
						if(vormField) {
							vormField.addModel(ctrl);
							$scope.$on('$destroy', function ( ) {
								vormField.removeModel(ctrl);
							});
						}
					};
				
				}],
				controllerAs: 'vormModel',
				link: function ( scope, element, attrs, controllers ) {
					controllers.shift().link(controllers);
				}
			
			};
		
		}]);
})();
