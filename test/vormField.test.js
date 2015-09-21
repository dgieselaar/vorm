import angular from 'angular';
import 'angular-mocks';
import '../src/vorm';

describe('vormField', function ( ) {
	
	let $rootScope,
		$compile,
		VormValueType;
		
	beforeEach(angular.mock.module('vorm'));
	
	beforeEach(angular.mock.inject([ '$rootScope', '$compile', 'VormValueType', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		VormValueType = arguments[2];
		
	}]));
	
	describe('when linked', function ( ) {
		
		let element,
			ctrl,
			formCtrl,
			nameCtrl,
			ageCtrl,
			form;
		
		beforeEach(function ( ) {
			
			form = angular.element('<form vorm-form></form>');
			$compile(form)($rootScope.$new());
			
			element = angular.element(`
				<div vorm-field>
					<input type="text" ng-model="name" name="name" ng-minlength="3"/>
					<input type="text" ng-model="age" name="age" ng-required="true"/>
				</div>
			`);
			
			form.append(element);
			
			formCtrl = form.inheritedData('$vormFormController');
			
			$compile(element)(form.scope().$new());
			
			ctrl = element.inheritedData('$vormFieldController');
			nameCtrl = element.find('input').eq(0).inheritedData('$ngModelController');
			ageCtrl = element.find('input').eq(1).inheritedData('$ngModelController');
			
			$rootScope.$digest();
			
		});
		
		it('should have the model', function ( ) {
			
			expect(ctrl.getModels()[0]).toBe(nameCtrl);
			
		});
		
		it('should return the modelValue', function ( ) {
			
			nameCtrl.$setViewValue('test');
			
			expect(ctrl.getValue()).toBe('test');
			
		});
		
		it('should set the model value when changed', function ( ) {
			
			ctrl.setValue('test');
			
			$rootScope.$digest();
			
			expect(nameCtrl.$modelValue).toBe('test');
			
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
				
				expect(nameCtrl.$modelValue).toBe('test');
			});
			
			it('should return the value as a list', function ( ) {
				
				nameCtrl.$setViewValue('test');
				
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
				
				expect(nameCtrl.$modelValue).toBe('test');
				
			});
			
			it('should return the value as key-value', function ( ) {
				
				nameCtrl.$setViewValue('test');
				
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
				
				nameCtrl.$setDirty();
				
				expect(ctrl.isPristine()).toBe(false);
				expect(ctrl.isDirty()).toBe(true);
			});
			
			it('should set the model\'s pristine/dirty state', function ( ) {
				
				ctrl.setDirty();
				
				expect(nameCtrl.$dirty).toBe(true);
				
				ctrl.setPristine();
				
				expect(nameCtrl.$pristine).toBe(true);
				
			});
			
			it('should reflect the model\'s touched/untouched state', function ( ) {
				
				expect(ctrl.isUntouched()).toBe(true);
				expect(ctrl.isTouched()).toBe(false);
				
				nameCtrl.$setTouched();
				
				expect(ctrl.isUntouched()).toBe(false);
				expect(ctrl.isTouched()).toBe(true);
				
			});
			
			it('should set the model\'s touched/untouched state', function ( ) {
				
				ctrl.setTouched();
				
				expect(nameCtrl.$touched).toBe(true);
				
				ctrl.setUntouched();
				
				expect(nameCtrl.$untouched).toBe(true);
				
			});
			
			it('should be invalid', function ( ) {
				
				expect(ctrl.isInvalid()).toBe(true);
				
			});
			
			it('should be invalid after age is set', function ( ) {
				
				ageCtrl.$setViewValue(10);
				nameCtrl.$setViewValue('ab');
				$rootScope.$digest();
				
				expect(ctrl.isInvalid()).toBe(true);
				
			});
			
			it('should be valid after name is set', function ( ) {
				
				ageCtrl.$setViewValue(10);
				nameCtrl.$setViewValue('test');
				
				$rootScope.$digest();
				
				expect(ctrl.isValid()).toBe(true);
				
			});
			
		});

		it('should unlink', function ( ) {
			
			expect(formCtrl.getFields().length).toBe(1);
			
			element.scope().$destroy();
			
			expect(formCtrl.getFields().length).toBe(0);
			
		});
		
	});
	
});
