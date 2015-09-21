import angular from 'angular';
import 'angular-mocks';
import '../src/vorm';

describe('vormFieldTemplate', function ( ) {
	
	var $rootScope,
		$compile,
		form,
		scope,
		vormFormCtrl,
		vormFieldCtrl,
		vormFieldTemplateCtrl;
				
	beforeEach(angular.mock.module('vorm'));
	
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
		
		vormFormCtrl = form.controller('vormForm');
		vormFieldCtrl = vormFormCtrl.getFields()[0];
		
		vormFieldTemplateCtrl = form.children().eq(0).controller('vormFieldTemplate');
	}
	
	beforeEach(angular.mock.inject([ '$rootScope', '$compile', function ( ) {
		
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
	
});
