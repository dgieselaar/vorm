/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.config([ 'vormTemplateServiceProvider', function ( vormTemplateServiceProvider ) {
			
			const templates = 
				_('date datetime datetime-local email month number password search tel text time url week checkbox'.split(' '))
					.zipObject()
					.mapValues(function ( value, key ) {
						var placeholder = _.includes('text search tel url email number password'.split(' '), key) ?
							`placeholder="{{vormControl.invokeData('placeholder')}}"`
							: '';
						return `<input type="${key}" ${placeholder}/>`;
					})
					.value();
					
			for(let type in templates) {
				vormTemplateServiceProvider.registerType(type, angular.element(templates[type]));
			}
			
		}]);
	
})();
