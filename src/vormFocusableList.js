import angular from 'angular';
import _ from 'lodash';

angular.module('vorm')
	.directive('vormFocusableList', [ function ( ) {
		
		return {
			controller: [ function ( ) {
				
				let ctrl = this,
					ids = [];
				
				ctrl.addId = function ( id ) {
					ids.push(id);
				};
				
				ctrl.removeId = function ( id ) {
					_.pull(ids, id);
				};
				
				ctrl.getId = function ( ) {
					return ids[ids.length - 1];
				};
				
			}]
		};
		
	}]);
