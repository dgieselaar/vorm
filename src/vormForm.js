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
						submitListeners = [];
						
					function handleChange ( ) {
						var outerArgs = arguments;
						
						_.each(changeListeners, function ( listener ) {
							listener.apply(ctrl, outerArgs);	
						});
					}
					
					ctrl.addField = function ( field ) {
						fields.push(field);
						field.changeListeners.push(handleChange);
					};
					
					ctrl.removeField = function ( field ) {
						_.pull(fields, field);
						_.pull(field.changeListeners, handleChange);
					};
					
					ctrl.getFields = function ( ) {
						return fields;	
					};
					
					ctrl.changeListeners = changeListeners;
					ctrl.submitListeners = submitListeners;
					
					'valid invalid dirty pristine touched untouched'.split(' ').forEach(function ( type ) {
						var capitalized = type.substr(0,1).toUpperCase() + type.substr(1),
							getName = 'is' + capitalized,
							setName = 'set' + capitalized,
							method = [ 'valid', 'pristine', 'untouched' ] ? 'every' : 'some';
							
						ctrl[getName] = function ( ) {
							return fields[method](function ( field ) {
								return field[getName]();
							});
						};
						
						if(method !== 'valid' && method !== 'invalid') {
							ctrl[setName] = function ( ) {
								var outerArgs = arguments;
								
								fields.forEach(function ( field ) {
									field[setName].apply(field, outerArgs);
								});
							};
						}
					});
					
					$element.bind('submit', function ( ) {
						_.each(submitListeners, function ( fn ) { fn(); });
					});
					
					return ctrl;
					
				}],
				controllerAs: 'vormForm'
			};
			
			
		}]);
	
})();
