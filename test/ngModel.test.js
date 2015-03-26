/*global angular,describe, beforeEach, module, it, expect,inject*/
describe('vorm', function() {
	
	var element,
		$rootScope,
		$compile;
		
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
		element = angular.element('<form vorm-form></form>');
		$compile(element)($rootScope);
		$rootScope.$digest();
		
	}]));
	
	describe('when linked without vorm-field', function ( ) {
		
		var el,
			vormCtrl;
			
		beforeEach(function ( ) {
			
			el = angular.element('<input type="text" ng-model="text"/>');
					
			element.append(el);
			$compile(el)(element.scope().$new());
			$rootScope.$digest();
			
			vormCtrl = element.inheritedData('$vormFormController');
		});
		
			
		it('should register itself with the vorm controller', function ( ) {
			
			expect(vormCtrl.getFields().length).toBe(1);
			
		});
		
		it('should have the name of the ngModel attribute', function ( ) {
			
			var fieldCtrl = vormCtrl.getFields()[0];
			
			expect(fieldCtrl.getName()).toBe('text');
			
		});
		
		it('should unregister itself when destroyed', function ( ) {
			
			expect(vormCtrl.getFields().length).toBe(1);
			
			el.scope().$destroy();
			el.remove();
			
			expect(vormCtrl.getFields().length).toBe(0);
			
		});
		
	});
	
	describe('when linked with vorm-field', function ( ) {
		
		var el,
			vormFieldCtrl;
			
		beforeEach(function ( ) {
			
			el = angular.element('<div vorm-field="text"></div>');
			element.append(el);
			$compile(el)(element.scope());
			
			vormFieldCtrl = el.inheritedData('$vormFieldController');
			
		});
		
		it('should register itself with the vorm field controller', function ( ) {
			
			var modelEl = angular.element('<input type="text" ng-model="foo"/>');
			
			el.append(modelEl);
			
			$compile(modelEl)(el.scope().$new());
			
			expect(vormFieldCtrl.getModels().length).toBe(1);
			
		});
		
		it('should unregister itself with the vorm field controller', function ( ) {
			
			var modelEl = angular.element('<input type="text" ng-model="foo"/>');
			
			el.append(modelEl);
			
			$compile(modelEl)(el.scope().$new());
			
			expect(vormFieldCtrl.getModels().length).toBe(1);
			
			modelEl.scope().$destroy();
			modelEl.remove();
			
			expect(vormFieldCtrl.getModels().length).toBe(0);
			
		});
		
	});

	describe('when told to ignore', function ( ) {
		
		it('should not create a vorm-field controller', function ( ) {
			
			var element = angular.element(`<input type="text" ng-model="foo" vorm-field-ignore/>`);
			
			$compile(element)($rootScope.$new());
			element.scope().$digest();
			
			expect(element.controller('vormField')).toBeUndefined();
			
		});
		
	});
  
});
