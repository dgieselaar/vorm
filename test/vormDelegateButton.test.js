import angular from 'angular';
import 'angular-mocks';
import '../src/vorm';

describe('vormDelegateButton', function ( ) {
	
	var $rootScope,
		$compile,
		element,
		buttonCtrl;
	
	beforeEach(angular.mock.module('vorm'));
	
	beforeEach(angular.mock.inject([ '$rootScope', '$compile', function ( ) {
		
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
		
		buttonCtrl = angular.element(element[0].querySelector('.vorm-delegate-button')).controller('vormDelegateButton');
	}
	
	it('should have a controller', function ( ) {
		
		compileWith({});
		
		expect(buttonCtrl).toBeDefined();
	});
	
	it('should call vormControlList.handleCreateClick when clicked', function ( ) {
		
		compileWith({});
		
		const listCtrl = element.find('vorm-control-list').controller('vormControlList');
		
		spyOn(listCtrl, 'handleCreateClick');
		
		buttonCtrl.handleClick();
		
		expect(listCtrl.handleCreateClick).toHaveBeenCalled();
		
	});
	
	it('should return an empty label if left empty', function ( ) {
		
		compileWith({});
		
		expect(buttonCtrl.getLabel()).toBe('');
		
	});
	
	it('should return the label if defined', function ( ) {
		
		compileWith({
			valueType: {
				type: 'list',
				addLabel: 'add'
			}
		});
		
		expect(buttonCtrl.getLabel()).toBe('add');
		
	});
	
	it('should be disabled if the limit is reached', function ( ) {
		
		compileWith({
			valueType: {
				type: 'list',
				limit: 1
			}
		});
		
		expect(buttonCtrl.isDisabled()).toBe(true);
		
	});
	
	it('should be enabled if the limit isn\'t reached', function ( ) {
		
		compileWith({
			valueType: {
				type: 'list',
				limit: 2
			}
		});
		
		expect(buttonCtrl.isDisabled()).toBe(false);
		
	});
	
	it('should be invisible', function ( ) {
		
		compileWith();
		
		expect(buttonCtrl.isVisible()).toBe(false);
		
	});
	
	it('should be visible when valueType is not single', function ( ) {
		
		compileWith({
			valueType: 'list'
		});
		
		expect(buttonCtrl.isVisible()).toBe(true);
		
	});
	
});
