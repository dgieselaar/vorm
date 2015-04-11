/*global angular,describe,beforeEach,inject,module,it,expect,spyOn*/
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
		
		tpl = form.children();
		
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
	
	it('should set a valuetype of list when requested', function ( ) {
		
		compileWith({
			name: 'test',
			type: 'text',
			valueType: 'list'
		});
		
		expect(vormFieldCtrl.getValueType()).toBe('list');
		
	});
	
	// it('should set the limit to what is defined', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: { 
	// 			type: 'list',
	// 			limit: 10
	// 		}
	// 	});
		
	// 	expect(vormFieldTemplateCtrl.getDelegateLimit()).toBe(10);
		
	// });
	
	// it('should use the default add label if not defined', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: 'list'
	// 	});
		
	// 	expect(vormFieldTemplateCtrl.getAddLabel()).toBe('');
		
	// });
	
	// it('should set the add label if defined', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: {
	// 			type: 'list',
	// 			limit: 10,
	// 			addLabel: 'Add'
	// 		}
	// 	});
		
	// 	expect(vormFieldTemplateCtrl.getAddLabel()).toBe('Add');
		
	// });
	
	// it('should return the data', function ( ) {
		
	// 	let data = {
	// 		foo: 'bar'
	// 	};
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		data: data
	// 	});
		
	// 	expect(vormFieldTemplateCtrl.getInputData()).toEqual(data);
		
	// });
	
	// it('should add an input to its list', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: {
	// 			type: 'list',
	// 			limit: 3
	// 		}
	// 	});
		
	// 	spyOn(vormFieldTemplateCtrl, 'addInput').and.callThrough();
		
	// 	vormFieldTemplateCtrl.handleDelegateAddClick();
		
	// 	scope.$digest();
		
	// 	expect(vormFieldTemplateCtrl.addInput).toHaveBeenCalled();
		
	// });
	
	// it('should remove an input from its list', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: {
	// 			type: 'list',
	// 			limit: 3
	// 		}
	// 	});
		
	// 	spyOn(vormFieldTemplateCtrl, 'removeInput').and.callThrough();
		
	// 	vormFieldTemplateCtrl.handleDelegateAddClick();
		
	// 	scope.$digest();
		
	// 	vormFieldTemplateCtrl.handleDelegateClearClick(vormFieldTemplateCtrl.getDelegates()[0]);
		
	// 	scope.$digest();
		
	// 	expect(vormFieldTemplateCtrl.removeInput).toHaveBeenCalled();
		
	// });
	
	// it('should trigger a view change when delegates are cleared or added ', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: {
	// 			type: 'list',
	// 			limit: 3
	// 		}
	// 	});
		
	// 	spyOn(vormFieldCtrl, 'triggerViewChange').and.callThrough();
		
	// 	vormFieldTemplateCtrl.handleDelegateAddClick();
		
	// 	scope.$digest();
		
	// 	expect(vormFieldCtrl.triggerViewChange).toHaveBeenCalled();
		
	// 	expect(vormFieldCtrl.getValue().length).toBe(2);
		
	// 	expect(vormFormCtrl.getValues().test.length).toBe(2);
		
	// 	vormFieldTemplateCtrl.handleDelegateClearClick(vormFieldTemplateCtrl.getDelegates().concat().pop());
		
	// 	scope.$digest();
		
	// 	expect(vormFieldCtrl.getValue().length).toBe(1);
		
	// 	expect(vormFormCtrl.getValues().test.length).toBe(1);
		
	// });
	
	// it('should return the input id of the last input', function ( ) {
		
	// 	compileWith({
	// 		name: 'test',
	// 		type: 'text',
	// 		valueType: {
	// 			type: 'list',
	// 			limit: 3
	// 		}
	// 	});
		
	// 	vormFieldTemplateCtrl.handleDelegateAddClick();
	// 	vormFieldTemplateCtrl.handleDelegateAddClick();
		
	// 	scope.$digest();
		
	// 	const inputs = vormFieldTemplateCtrl.getInputs();
	// 	const lastInput = inputs.concat().pop();
		
	// 	expect(lastInput.getInputId()).toBe(vormFieldTemplateCtrl.getLastInputId());
		
		
		
	// });
	
});
