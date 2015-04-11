/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormFieldCtrl', [ 'VormEvent', 'VormValueType', function ( VormEvent, VormValueType ) {
			
			return function ( name, element ) {
				
				const ctrl = {},
					models = [],
					viewChangeListeners = [],
					modelChangeListeners = [],
					prefix = 'vorm-field-';
				
				let valueType = VormValueType.SINGLE,
					required;
				
				function setModelValue ( model, value ) {
					// $$writeModelToScope calls the view listeners
					// and we don't really want that
					const { $viewChangeListeners, $modelValue } = model;
						
					model.$viewChangeListeners = [];
					model.$modelValue = value;
					model.$$writeModelToScope();
					
					// reset all the things
					model.listeners = $viewChangeListeners;
					model.$modelValue = $modelValue;
				}
				
				function handleViewChange ( ) {
					ctrl.triggerViewChange();
				}
				
				function handleFormatterCall ( ) {
					// now we know the model has changed
					ctrl.triggerModelChange();
				}
				
				ctrl.triggerModelChange = function ( ) {
					element.dispatchEvent(new VormEvent('modelchange', { name: name } ));
					_.invoke(modelChangeListeners, 'call', null, name);
				};
				
				ctrl.triggerViewChange = function ( ) {
					element.dispatchEvent(new VormEvent('viewchange', { name: name } ));
					_.invoke(viewChangeListeners, 'call', null, name);
				};
				
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
					let value;
					
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
						const modelsToChange = models.concat();
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
				
				ctrl.isRequired = function ( ) {
					return required;	
				};
				
				ctrl.setRequired = function ( ) {
					required = !!arguments[0];
				};
				
				ctrl.isEmpty = function ( ) {
					return models.every(function ( model ) {
						return model.$isEmpty();
					});
				};
				
				let chain = _('valid invalid dirty pristine touched untouched required empty'.split(' '))
						.map(function ( key ) {
							return prefix + key;
						})
						.zipObject()
						.mapValues(function ( value, key ) {
							let m = key.substr(prefix.length);
							return ctrl['is' + _.capitalize(m)]();
						})
						.each(function ( ) {
							
						});
						
				ctrl.getClassObj = function ( ) {
					return chain.value();
				};
				
				ctrl.viewChangeListeners = viewChangeListeners;
				ctrl.modelChangeListeners = modelChangeListeners;
			
				'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
					const capitalized = _.capitalize(type),
						getName = 'is' + capitalized,
						propertyName = '$' + type,
						setName = 'set' + capitalized,
						method = [ 'valid', 'pristine', 'untouched' ].indexOf(type) !== -1 ? 'every' : 'some';
						
					ctrl[getName] = function ( ) {
						return models[method](function ( model ) {
							return model[propertyName];
						});
					};
					
					if(type !== 'valid' && type !== 'invalid') {
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
