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
		
		const tplEl = form.children().eq(0);
		
		scope.config = config;
		
		$compile(form)(scope);
		
		$rootScope.$digest();
		
		tpl = form.children();
		
		let children = form;
		
		vormFormCtrl = form.controller('vormForm');
		vormFieldCtrl = vormFormCtrl.getFields()[0];
		
		vormFieldTemplateCtrl = form.children().eq(0).controller('vormFieldTemplate');
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
		
		expect(vormFieldCtrl).toBeDefined();
		
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
		
		expect(form.find('input').length).toBe(1);
		
	});
	
	it('should a valuetype of list when limit > 1', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			limit: 2
		});
		
		expect(vormFieldCtrl.getValueType()).toBe('list');
		
	});
	
	it('should return the data', function ( ) {
		
		let data = {
			foo: 'bar'
		};
		
		compileWith({
			name: 'test',
			type: 'text',
			data: data
		});
		
		expect(vormFieldTemplateCtrl.getInputData()).toEqual(data);
		
	});
	
	it('should add an input to its list', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			limit: 3
		});
		
		spyOn(vormFieldTemplateCtrl, 'addInput').and.callThrough();
		
		vormFieldTemplateCtrl.addDelegate();
		
		scope.$digest();
		
		expect(vormFieldTemplateCtrl.addInput).toHaveBeenCalled();
		
	});
	
	it('should remove an input from its list', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			limit: 3
		});
		
		spyOn(vormFieldTemplateCtrl, 'removeInput').and.callThrough();
		
		vormFieldTemplateCtrl.addDelegate();
		
		scope.$digest();
		
		vormFieldTemplateCtrl.clearDelegate(vormFieldTemplateCtrl.getDelegates()[0]);
		
		scope.$digest();
		
		expect(vormFieldTemplateCtrl.removeInput).toHaveBeenCalled();
		
	});
	
});
