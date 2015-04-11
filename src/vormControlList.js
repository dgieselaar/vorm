/*global angular,_*/
(function ( ) {

	angular.module('vorm')
		.directive('vormControlList', [ 'vormTemplateService', 'VormModelDelegate', function ( vormTemplateService, VormModelDelegate ) {
			
			return {
				require: [ 'vormControlList', '^vormFieldConfig', '^vormField' ],
				restrict: 'E',
				template: vormTemplateService.getDefaultControlTemplate(),
				controller: [ '$scope', function ( $scope ) {
					
					let ctrl = this,
						delegates = [],
						limit = NaN,
						vormFieldConfig,
						vormField;
						
					function triggerAsyncViewChange ( ) {
						let unwatch = $scope.$watchCollection(vormField.getModels, function ( ) {
							vormField.triggerViewChange();
							
							unwatch();
						});
					}
						
					ctrl.link = function ( controllers ) {
						
						let typeOpts;
						
						vormFieldConfig = controllers[0];
						vormField = controllers[1];
						
						typeOpts = vormFieldConfig.getConfig().valueType;
						
						if(typeOpts && typeOpts.limit !== undefined) {
							limit = typeOpts.limit;
						}
					};
					
					ctrl.getDelegates = function ( ) {
						return delegates;	
					};
					
					ctrl.createDelegate = function ( name ) {
						let delegate;
						
						if(!name) {
							name = delegates.length.toString();
						}
						
						delegate = new VormModelDelegate(name);
						delegates.push(delegate);
					};
					
					ctrl.removeDelegate = function ( delegate ) {
						_.pull(delegates, delegate);
					};
					
					ctrl.clearDelegate = function ( delegate ) {
						delegate.clearViewValue();
					};
					
					ctrl.getLimit = function ( ) {
						return limit;	
					};
					
					ctrl.setLimit = function ( l ) {
						limit = Number(l);
					};
					
					ctrl.reachedLimit = function ( ) {
						return limit > 0 && delegates.length > limit;
					};
					
					ctrl.isClearButtonVisible = function ( ) {
						return delegates.length > 1;
					};
					
					ctrl.handleCreateClick = function ( ) {
						ctrl.createDelegate();
						triggerAsyncViewChange();	
					};
					
					ctrl.handleClearClick = function ( delegate ) {
						if(delegates.length === 1) {
							delegate.clearViewValue();
						} else {
							ctrl.removeDelegate(delegate);
							triggerAsyncViewChange();
						}
					};
					
				}],
				controllerAs: 'vormControlList',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers[0].link(controllers.slice(1));
					
				}
			};
			
		}]);
	
})();
