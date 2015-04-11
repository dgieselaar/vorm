/*global describe,beforeEach,module,inject,angular,it,expect,spyOn*/
describe('vormFieldConfig', function ( ) {
	
	var $rootScope,
		$compile,
		element,
		configCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
		element = angular.element(`
			<vorm-field-template config="config">
			</vorm-field-template>
		`);
	}]));
	
	function compileWith ( config ) {
		
		config = config || {};
		
		config.name = 'test';
		config.type = 'text';
		
		$rootScope.config = config;
		
		$compile(element)($rootScope);
		
		$rootScope.$digest();
		
		configCtrl = element.controller('vormFieldConfig');
	}
	
	it('should have a controller', function ( ) {
		
		compileWith();
		
		expect(configCtrl).toBeDefined();
		
	});
	
	it('should continiously set the required state if invokable', function ( ) {
		
		var required = true,
			vormFieldCtrl;
		
		compileWith({
			required: function ( ) {
				return required;
			}
		});
		
		vormFieldCtrl = element.controller('vormField');
		
		expect(vormFieldCtrl.isRequired()).toBe(true);
		
		required = false;
		
		$rootScope.$digest();
		
		expect(vormFieldCtrl.isRequired()).toBe(false);
		
	});
	
});
