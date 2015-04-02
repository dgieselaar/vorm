/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormLabel', [ function ( ) {
			
			return {
				require: [ 'vormLabel', '^?vormFieldTemplate', '^?vormFieldWrapper' ],
				template: '<label>{{vormLabel.getLabel()}}</label>',
				replace: true,
				controller: [ function ( ) {
					
					var ctrl = this;
					
					ctrl.link = function ( controllers ) {
						
						ctrl.getLabel = _(controllers)
							.filter(_.identity)
							.pluck('getLabel')
							.value()[0];
						
					};
					
				}],
				controllerAs: 'vormLabel',
				link: function ( scope, element, attrs, controllers ) {
					controllers[0].link(controllers.slice(1));
				}
			};
			
		}]);
	
})();
