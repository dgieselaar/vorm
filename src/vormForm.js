/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.directive('vormForm', [ 'VormValueScope', function ( VormValueScope ) { 
			
			return {
				scope: true,
				require: [ 'form' ],
				controller: [ '$element', function ( $element ) {
					
					const ctrl = this,
						fields = [],
						changeListeners = [],
						submitListeners = [],
						valueScope = new VormValueScope();
						
					function handleChange ( ) {
						const outerArgs = arguments;
						
						_.each(changeListeners, function ( listener ) {
							listener.apply(ctrl, outerArgs);	
						});
					}
					
					ctrl.addField = function ( field ) {
						fields.push(field);
						field.viewChangeListeners.push(handleChange);
						field.setValueScope(valueScope);
					};
					
					ctrl.removeField = function ( field ) {
						_.pull(fields, field);
						_.pull(field.viewChangeListeners, handleChange);
					};
					
					ctrl.getFields = function ( ) {
						return fields;	
					};
					
					ctrl.getValues = function ( ) {
						let values = _(fields)
							.indexBy(function ( field ) {
								return field.getName();
							})
							.mapValues(function ( field ) {
								return field.getValue();
							})
							.value();
						
						return values;
					};
					
					ctrl.getValueScope = function ( ) {
						return valueScope;	
					};
					
					ctrl.changeListeners = changeListeners;
					ctrl.submitListeners = submitListeners;
					
					'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
						const capitalized = type.substr(0,1).toUpperCase() + type.substr(1),
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
								const outerArgs = arguments;
								
								fields.forEach(function ( field ) {
									field[setName].apply(field, outerArgs);
								});
							};
						}
					});
					
					$element.bind('submit', function ( ) {
						_.invoke(submitListeners, 'call', null, ctrl.getValues());
					});
					
					return ctrl;
					
				}],
				controllerAs: 'vormForm'
			};
			
			
		}]);
	
})();
