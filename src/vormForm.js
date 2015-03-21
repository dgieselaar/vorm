/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormForm', [ function ( ) { 
			
			return {
				scope: true,
				require: [ 'form' ],
				controller: [ '$element', function ( $element ) {
					
					var ctrl = this,
						fields = [],
						changeListeners = [],
						submitListeners = [],
						values = {};
						
					function recalc ( ) {
						values = _(fields)
							.indexBy(function ( field ) {
								return field.getName();
							})
							.mapValues(function ( field ) {
								return field.getValue();
							})
							.value();
							
						Object.freeze(values);
					}
						
					function handleChange ( ) {
						var outerArgs = arguments;
						
						recalc();
						
						_.each(changeListeners, function ( listener ) {
							listener.apply(ctrl, outerArgs);	
						});
					}
					
					function handleModelChange ( ) {
						recalc();
					}
					
					ctrl.addField = function ( field ) {
						fields.push(field);
						field.viewChangeListeners.push(handleChange);
						field.modelChangeListeners.push(handleModelChange);
						recalc();
					};
					
					ctrl.removeField = function ( field ) {
						_.pull(fields, field);
						_.pull(field.viewChangeListeners, handleChange);
						_.pull(field.modelChangeListeners, handleModelChange);
						recalc();
					};
					
					ctrl.getFields = function ( ) {
						return fields;	
					};
					
					ctrl.getValues = function ( ) {
						return values;
					};
					
					ctrl.changeListeners = changeListeners;
					ctrl.submitListeners = submitListeners;
					
					'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
						var capitalized = type.substr(0,1).toUpperCase() + type.substr(1),
							getName = 'is' + capitalized,
							setName = 'set' + capitalized,
							method = [ 'valid', 'pristine', 'untouched' ].indexOf(type) !== -1 ? 'every' : 'some';
							
						ctrl[getName] = function ( ) {
							return fields[method](function ( field ) {
								return field[getName]();
							});
						};
						
						if(!(type === 'valid' || type === 'invalid')) {
							ctrl[setName] = function ( ) {
								var outerArgs = arguments;
								
								fields.forEach(function ( field ) {
									field[setName].apply(field, outerArgs);
								});
							};
						}
					});
					
					$element.bind('submit', function ( ) {
						_.invoke(submitListeners, 'call', null, values);
					});
					
					return ctrl;
					
				}],
				controllerAs: 'vormForm'
			};
			
			
		}]);
	
})();
