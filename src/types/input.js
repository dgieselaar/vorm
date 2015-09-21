import angular from 'angular';
import _ from 'lodash';
	
angular.module('vorm')
	.config([ 'vormTemplateServiceProvider', function ( vormTemplateServiceProvider ) {
		
		const templates =
			_('date datetime datetime-local email month number password search tel text time url week checkbox'.split(' '))
				.zipObject()
				.mapValues(function ( value, key ) {
					var placeholder = _.includes('text search tel url email number password'.split(' '), key) ?
						`placeholder="{{vormControl.invokeData('placeholder')}}"`
						: '',
						tpl = `<input type="${key}" ${placeholder} ng-model/>`;
					
					if(key === 'checkbox') {
						tpl =
							`<label for="{{vormControl.getInputId()}}">
								${tpl}
								{{vormControl.invokeData("checkboxLabel")}}
							</label>`;
					}
					return tpl;
				})
				.value();
				
		for(let type in templates) {
			vormTemplateServiceProvider.registerType(type, angular.element(templates[type]));
		}
		
	}]);
