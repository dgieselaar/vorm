/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormFieldCtrl', function ( ) {
			
			return function ( name, bindTo ) {
				
				var ctrl = {},
					models = [],
					changeListeners = [];
					
				if(bindTo === undefined) {
					bindTo = ctrl;
				}
				
				function setModelValue ( model, value ) {
					bindTo[model.$name] = value;
				}
				
				ctrl.getName = function ( ) {
					return name;
				};
					
				ctrl.addModel = function ( model ) {
					models.push(model);
				};
				
				ctrl.removeModel = function ( model ) {
					_.pull(models, model);
				};
				
				ctrl.getModels = function ( ) {
					return models;
				};
				
				ctrl.getValue = function ( ) {
					return ctrl.getValueList()[0];
				};
				
				ctrl.getValueList = function ( ) {
					return _.pluck(models, '$modelValue');
				};
				
				ctrl.setValue = function ( value ) {
					var model = models[0];
					
					if(model) {
						setModelValue(model, value);
					}
				};
				
				ctrl.setValueList = function ( values ) {
					
					if(!values) {
						values = [];
					}
					
					models.forEach(function ( model, index ) {
						var value = values[index];
						setModelValue(model, value);
					});
					
				};
				
				ctrl.changeListeners = changeListeners;
				
				'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
					var capitalized = type.substr(0,1).toUpperCase() + type.substr(1),
						getName = 'is' + capitalized,
						propertyName = '$' + type,
						setName = 'set' + capitalized,
						method = [ 'valid', 'pristine', 'untouched' ] ? 'every' : 'some';
						
					ctrl[getName] = function ( ) {
						return models[method](function ( field ) {
							return field[propertyName];
						});
					};
					
					if(method !== 'valid' && method !== 'invalid') {
						ctrl[setName] = function ( ) {
							var outerArgs = arguments;
							
							models.forEach(function ( field ) {
								field[setName].apply(field, outerArgs);
							});
						};
					}
				});
				
				return ctrl;
			};
			
		});
	
})();
