/*global angular,_*/
(function ( ) {

	angular.module('vorm')
		.directive('vormControlList', [  'VormModelDelegate', '$document', function ( VormModelDelegate, $document ) {
			
			return {
				require: [ 'vormControlList', '^vormFieldConfig', '^?vormFocusableList', '^vormField' ],
				restrict: 'E',
				controller: [ '$scope', function ( $scope ) {
					
					let ctrl = this,
						delegates = [],
						limit = NaN,
						vormFieldConfig,
						vormFocusableList,
						vormField;
						
					function triggerAsyncViewChange ( callback ) {
						let unwatch = $scope.$watchCollection(vormField.getModels, function ( ) {
							
							vormField.triggerViewChange();
							
							callback();
							
							unwatch();
						});
					}
					
					function setFocus ( ) {
						if(vormFocusableList) {
							let id = vormFocusableList.getId(),
								el = $document[0].getElementById(id);
							
							if(el) {
								el.focus();
							}
						}
					}
						
					ctrl.link = function ( controllers ) {
						
						vormFieldConfig = controllers[0];
						vormFocusableList = controllers[1];
						vormField = controllers[2];
						
						$scope.$watch(vormFieldConfig.getLimit, function ( limit ) {
							ctrl.setLimit(limit);
						});
						
						ctrl.createDelegate();
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
						return limit > 0 && delegates.length >= limit;
					};
					
					ctrl.isClearButtonVisible = function ( ) {
						return vormField.getValueType() === 'list';
					};
					
					ctrl.handleCreateClick = function ( ) {
						ctrl.createDelegate();
						triggerAsyncViewChange(setFocus);
					};
					
					ctrl.handleClearClick = function ( delegate ) {
						if(delegates.length === 1) {
							delegate.clearViewValue();
						} else {
							ctrl.removeDelegate(delegate);
							triggerAsyncViewChange(setFocus);
						}
					};
					
				}],
				controllerAs: 'vormControlList',
				link: function ( scope, element, attrs, controllers ) {
					
					controllers.shift().link(controllers);
					
				}
			};
			
		}]);
	
})();
