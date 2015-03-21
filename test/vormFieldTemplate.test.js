/*global angular,describe,beforeEach,inject,module,it,expect*/
describe('vormFieldTemplate', function ( ) {
	
	var $rootScope,
		$compile,
		form,
		tpl,
		scope,
		vormFormCtrl,
		vormFieldCtrl,
		vormFieldTemplateCtrl;
		
	beforeEach(module('vorm'));
	
	function compileWith ( config ) {
		
		scope = $rootScope.$new();
		
		form = angular.element(`
			<form vorm-form>
				<vorm-field-template data-config="config">
				</vorm-field-template>
			</form>
		`);
		
		scope.config = config;
		
		$compile(form)(scope);
		
		$rootScope.$digest();
		
		tpl = form.find('div').eq(0);
		
		vormFormCtrl = form.inheritedData('$vormFormController');
		vormFieldTemplateCtrl = tpl.inheritedData('$vormFieldTemplateController');
		vormFieldCtrl = tpl.inheritedData('$vormFieldController');
	}
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
	}]));
	
	it('should generate a vorm-field', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			label: 'Test'
		});
		
		expect(vormFieldCtrl).not.toBeUndefined();
		
	});
	
	it('should err when name or type is empty', function ( ) {
		
		expect(function ( ) {
			compileWith({
				name: '',
				type: 'text',
				label: 'Test'
			});
		}).toThrowError();
		
		expect(function ( ) {
			compileWith({
				name: 'typeless',
				type: '',
				label: 'Test'
			});
		}).toThrowError();
		
	});
	
	it('should have a input field', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			label: 'Test'
		});
		
		expect(tpl.find('input').length).toBe(1);
		
	});
	
	it('should a valuetype of list when limit > 1', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			limit: 2
		});
		
		expect(vormFieldCtrl.getValueType()).toBe('list');
		
	});
	
	it('should return the configuration data', function ( ) {
		
		var data = { foo: 'bar' };
		
		compileWith({
			name: 'test',
			type: 'text',
			data: data
		});
		
		expect(vormFieldTemplateCtrl.getInputData()).toEqual(data);
		
	});
	
});
