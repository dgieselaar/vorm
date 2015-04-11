/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormModelCtrl', [ function ( ) {
			
			return function ( ) {
				
				let ctrl = this,
					name,
					ngModel,
					holders = {
						viewChangeListeners: [],
						validators: [],
						asyncValidators: [],
						formatters: [],
						parsers: []
					};
					
				_.each(holders, function ( collection, key ) {
					ctrl[key] = {
						add: function ( val ) {
							collection.push(val);
							if(ngModel) {
								ngModel['$' + key].push(val);
							}
						},
						remove: function ( val ) {
							_.pull(collection, val);
							if(ngModel) {
								_.pull(ngModel['$' + key], val);
							}
						},
						get: function ( ) {
							return collection;
						}
					};
				});
					
				ctrl.setName = function ( nm ) {
					name = nm;
				};
				
				ctrl.getName = function ( ) {
					return name;	
				};
				
				ctrl.setNgModel = function ( model ) {
					if(model) {
						throw new Error('vorm/model-set');
					}
					
					ngModel = model;
					
					_.each(holders, function ( collection, key) {
						Array.prototype.push.apply(ngModel['$'+ key], collection);
					});
					
					return function ( ) {
						ngModel = null;
					};
					
				};
				
				'pending untouched touched pristine dirty valid invalid'.split(' ').forEach(function ( key ) {
					let methodName = 'is' + _.capitalize(key),
						accessorName = '$' + key;
						
					ctrl[methodName] = function ( ) { 
						return ngModel ? ngModel[accessorName] : undefined; 
					};
					
				});
				
				ctrl.setViewValue = function ( value ) {
					ngModel.$setViewValue(value);
					ngModel.$render();
				};
					
				ctrl.value = null;
				
				return ctrl;
				
			};
			
		}]);
	
})();
