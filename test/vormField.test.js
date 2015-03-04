/*global describe,beforeEach,module,it,angular,inject,expect*/
describe('vormField', function ( ) {
	
	let $rootScope,
		$compile,
		VormValueType;
		
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', 'VormValueType', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		VormValueType = arguments[2];
		
	}]));
	
	describe('when linked', function ( ) {
		
		let element,
			ctrl,
			modelCtrl;
		
		beforeEach(function ( ) {
			
			element = angular.element(`
				<div vorm-field>
					<input type="text" ng-model="name" name="name"/>
					<input type="text" ng-model="age" name="age"/>
				</div>
			`);
			
			$compile(element)($rootScope.$new());
			
			ctrl = element.inheritedData('$vormFieldController');
			modelCtrl = element.find('input').inheritedData('$ngModelController');
			
		});
		
		it('should have the model', function ( )  {
			
			expect(ctrl.getModels()[0]).toBe(modelCtrl);
			
		});
		
		it('should return the modelValue', function ( ) {
			
			modelCtrl.$setViewValue('test');
			
			expect(ctrl.getValue()).toBe('test');
			
		});
		
		it('should set the model value when changed', function ( ) {
			
			ctrl.setValue('test');
			
			$rootScope.$digest();
			
			expect(modelCtrl.$modelValue).toBe('test');
			
		});
		
		it('should set the value type', function ( ) {
			
			ctrl.setValueType(VormValueType.NAMED);
			
			expect(ctrl.getValueType()).toBe(VormValueType.NAMED);
			
		});
		
		it('should throw an error for unsupported value types', function ( ) {
			
			expect(function ( ) {
				ctrl.setValueType('foo');
			}).toThrow();
			
		});
		
		describe('and value type is list', function ( ) {
			
			beforeEach(function ( ) {
				
				ctrl.setValueType(VormValueType.LIST);
				
			});
			
			it('should set the model value', function ( ) {
				
				ctrl.setValue([ 'test' ]);
				
				$rootScope.$digest();
				
				expect(modelCtrl.$modelValue).toBe('test');
			});
			
			it('should return the value as a list', function ( ) {
				
				modelCtrl.$setViewValue('test');
				
				expect(ctrl.getValue()).toEqual([ 'test', undefined ]);
				
			});
			
		});
		
		describe('and value type is named', function ( ) {
			
			beforeEach(function ( ) {
				
				ctrl.setValueType(VormValueType.NAMED);
				
			});
			
			it('should set the model value', function ( ) {
				
				ctrl.setValue({
					name: 'test'
				});
				
				$rootScope.$digest();
				
				expect(modelCtrl.$modelValue).toBe('test');
				
			});
			
			it('should return the value as key-value', function ( ) {
				
				modelCtrl.$setViewValue('test');
				
				expect(ctrl.getValue()).toEqual({
					name: 'test',
					age: undefined
				});
				
			});
			
		});
		
		describe('and values are set', function ( ) {
			
			it('should reflect the model\'s pristine/dirty state', function ( ) {
				
				expect(ctrl.isPristine()).toBe(true);
				expect(ctrl.isDirty()).toBe(false);
				
				modelCtrl.$setDirty();
				
				expect(ctrl.isPristine()).toBe(false);
				expect(ctrl.isDirty()).toBe(true);
			});
			
			it('should set the model\'s pristine/dirty state', function ( ) {
				
				ctrl.setDirty();
				
				expect(modelCtrl.$dirty).toBe(true);
				
				ctrl.setPristine();
				
				expect(modelCtrl.$pristine).toBe(true);
				
			});
			
			it('should reflect the model\'s touched state', function ( ) {
				
				expect(ctrl.isUntouched()).toBe(true);
				expect(ctrl.isTouched()).toBe(false);
				
				modelCtrl.$setTouched();
				
				expect(ctrl.isUntouched()).toBe(false);
				expect(ctrl.isTouched()).toBe(true);
				
			});
			
			it('should be valid', function ( ) {
				
				expect(ctrl.isValid()).toBe(true);
				
			});
			
		});
		
	});
	
});
