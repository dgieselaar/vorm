import angular from 'angular';
	
	angular.module('vorm')
		.directive('vormDelegateButton', [ function ( ) {
		
		return {
			require: [ 'vormDelegateButton', '^vormFieldConfig', '^vormControlList', '^vormField' ],
			template:
				`<button class="vorm-delegate-button" type="button" ng-click="vormDelegateButton.handleClick()" ng-disabled="vormDelegateButton.isDisabled()" ng-show="vormDelegateButton.isVisible()">
					{{vormDelegateButton.getLabel()}}
				</button>`,
			replace: true,
			controller: [ function ( ) {
				
				let ctrl = this,
					vormFieldConfig,
					vormControlList,
					vormField;
				
				ctrl.link = function ( controllers ) {
					vormFieldConfig = controllers[0];
					vormControlList = controllers[1];
					vormField = controllers[2];
				};
				
				ctrl.handleClick = function ( ) {
					vormControlList.handleCreateClick();
				};
				
				ctrl.isDisabled = function ( ) {
					return vormControlList.reachedLimit();
				};
				
				ctrl.isVisible = function ( ) {
					return vormField.getValueType() === 'list';
				};
				
				ctrl.getLabel = function ( ) {
					let config = vormFieldConfig.getConfig(),
						typeOptions = config ? config.valueType : null,
						addLabel = typeOptions && typeOptions.addLabel ? vormFieldConfig.invoke(typeOptions.addLabel) : '';
					
					return addLabel;
				};
				
			}],
			link: function ( scope, element, attrs, controllers ) {
				
				controllers.shift().link(controllers);
				
			},
			controllerAs: 'vormDelegateButton'
		};
		
	}]);
