/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormFieldCtrl', [ 'VormEvent', 'VormValueType', function ( VormEvent, VormValueType ) {
			
			return function ( name, element ) {
				
				var ctrl = {},
					models = [],
					viewChangeListeners = [],
					modelChangeListeners = [],
					valueType = VormValueType.SINGLE;
				
				function setModelValue ( model, value ) {
					// $$writeModelToScope calls the view listeners
					// and we don't really want that
					var { $viewChangeListeners, $modelValue } = model;
						
					model.$viewChangeListeners = [];
					model.$modelValue = value;
					model.$$writeModelToScope();
					
					// reset all the things
					model.listeners = $viewChangeListeners;
					model.$modelValue = $modelValue;
				}
				
				function handleViewChange ( ) {
					element.dispatchEvent(new VormEvent('viewchange', { name: name } ));
					_.invoke(viewChangeListeners, 'call', null, name);
				}
				
				function handleFormatterCall ( ) {
					// now we know the model has changed
					element.dispatchEvent(new VormEvent('modelchange', { name: name } ));
					_.invoke(modelChangeListeners, 'call', null, name);
				}
				
				ctrl.getName = function ( ) {
					return name;
				};
				
				ctrl.setName = function ( ) {
					name = arguments[0];
				};
					
				ctrl.addModel = function ( model ) {
					models.push(model);
					model.$viewChangeListeners.push(handleViewChange);
					model.$formatters.push(handleFormatterCall);
				};
				
				ctrl.removeModel = function ( model ) {
					_.pull(models, model);
					_.pull(model.$viewChangeListeners, handleViewChange);
					_.pull(model.$formatters, handleFormatterCall);
				};
				
				ctrl.getModels = function ( ) {
					return models;
				};
				
				ctrl.getValue = function ( ) {
					var value;
					
					switch(valueType) {
						case VormValueType.SINGLE:
						value = models[0] ? models[0].$modelValue : undefined;
						break;
						
						case VormValueType.LIST:
						value = _.pluck(models, '$modelValue');
						break;
						
						case VormValueType.NAMED:
						value = {};
						_.each(models, function ( model) {
							value[model.$name] = model.$modelValue;
						});
						break;
					}
					
					return value;
				};
				
				ctrl.getValueType = function ( ) {
					return valueType;	
				};
				
				ctrl.setValueType = function ( type ) {
					if([ VormValueType.SINGLE, VormValueType.LIST, VormValueType.NAMED ].indexOf(type) === -1) {
						throw new Error('Unsupported VormValueType: ' + VormValueType);
					}
					valueType = type;
				};
				
				ctrl.setValue = function ( value ) {
					switch(valueType) {
						case VormValueType.SINGLE:
						if(models[0]) {
							setModelValue(models[0], value);
						}
						break;
						
						case VormValueType.LIST:
						_.each(models, function ( model, index ) {
							setModelValue(model, value[index]);
						});
						break;
						
						case VormValueType.NAMED:
						let modelsToChange = models.concat();
						_.each(value, function ( val, key ) {
							var model = _.find(models, { $name: key });
							if(model) {
								setModelValue(model, val);
							}
							_.pull(modelsToChange, model);
						});
						
						_.each(modelsToChange, function ( model ) {
							setModelValue(model, undefined);
						});
						break;
					}
				};
				
				ctrl.viewChangeListeners = viewChangeListeners;
				ctrl.modelChangeListeners = modelChangeListeners;
				
				'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
					var capitalized = type.substr(0,1).toUpperCase() + type.substr(1),
						getName = 'is' + capitalized,
						propertyName = '$' + type,
						setName = 'set' + capitalized,
						method = [ 'valid', 'pristine', 'untouched' ].indexOf(type) !== -1 ? 'every' : 'some';
						
					ctrl[getName] = function ( ) {
						return models[method](function ( model ) {
							return model[propertyName];
						});
					};
					
					if(method !== 'valid' && method !== 'invalid') {
						ctrl[setName] = function ( ) {
							var outerArgs = arguments;
							
							models.forEach(function ( model ) {
								model['$' + setName].apply(model, outerArgs);
							});
						};
					}
				});
				
				return ctrl;
			};
			
		}]);
	
})();
