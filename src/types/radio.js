import angular from 'angular';

angular.module('vorm')
	.config([ 'vormTemplateServiceProvider', function ( vormTemplateServiceProvider ) {
		
		const el = angular.element(
			`<div class="vorm-radio-group">
				<label ng-repeat="option in vormControl.getOptions()">
					<input type="radio" ng-model name="{{::vormField.getName()}}" value="{{::option.value}}"/>
					{{::option.label}}
				</label>
			</div>`
		);
		
		vormTemplateServiceProvider.registerType('radio', el);
		
	}]);
