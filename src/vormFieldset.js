(function ( ) {
	
	angular.module('vorm')
		.directive('vormFieldset', [ function ( ) {
			
			return {
				restrict: 'E',
				template: `
					<vorm-field-template config="field" ng-repeat="field in vormFieldset.getFields()">
					</vorm-field-template>
				`,
				scope: {
					fields: '&'
				},
				replace: true,
				controller: [ '$scope', function ( $scope ) {
					
					var ctrl = this;
					
					ctrl.getFields = $scope.fields;
					
				}],
				controllerAs: 'vormFieldset'
			};
			
		}]);
	
})();
