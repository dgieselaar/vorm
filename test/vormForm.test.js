/*global angular,describe,beforeEach,inject,module,it,expect,jasmine*/
describe('vormForm', function ( ) {
	
	var scope,
		form,
		vormCtrl,
		modelCtrls;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		var [ $rootScope, $compile ] = arguments;
		
		scope = $rootScope.$new();
		
		scope.foo = 'a';
		scope.bar = 'b';
		
		form = angular.element(`
			<form vorm-form>
				<input type="text" ng-model="foo" name="foo"/>
				<input type="text" ng-model="bar" name="bar"/>
			</form>
		`);
		
		$compile(form)(scope);
		
		scope.$digest();
		
		vormCtrl = form.inheritedData('$vormFormController');
		modelCtrls = Array.prototype.slice.call(form[0].querySelectorAll('input'))
			.map(function ( el ) {
				return angular.element(el).inheritedData('$ngModelController');
			});
		
	}]));
	
	it('should have a controller', function ( ) {
		
		expect(vormCtrl).toBeDefined();
		
	});
	
	it('should have two vorm fields', function ( ) {
		
		expect(vormCtrl.getFields().length).toBe(2);
		
	});
	
	it('should by deault have the correct values', function ( ) {
		
		expect(vormCtrl.getValues()).toEqual({
			foo: 'a',
			bar: 'b'
		});
		
	});
	
	it('should update its values after a view change', function ( ) {
		
		var modelCtrl = angular.element(form[0].querySelector('[name="foo"]')).inheritedData('$ngModelController');
		
		modelCtrl.$setViewValue('c');
		
		expect(vormCtrl.getValues()).toEqual({
			foo: 'c',
			bar: 'b'
		});
		
	});
	
	it('should update its values after a model change', function ( ) {
		
		scope.foo = 'd';
		
		scope.$digest();
		
		expect(vormCtrl.getValues()).toEqual({
			foo: 'd',
			bar: 'b'
		});
		
	});
	
	it('should call the change listener for a view change', function ( ) {
		
		var modelCtrl = modelCtrls[0],
			test = jasmine.createSpy();
		
		vormCtrl.changeListeners.push(test);
		
		modelCtrl.$setViewValue('e');
		
		expect(test).toHaveBeenCalledWith('foo');
		
	});
	
	it('should call the submit listener', function ( ) {
		
		var test = jasmine.createSpy();
		
		vormCtrl.submitListeners.push(test);
		
		form.triggerHandler('submit');
		
		expect(test).toHaveBeenCalledWith(jasmine.objectContaining({
			foo: 'a',
			bar: 'b'
		}));
		
	});
	
	it('should reflect the state of its children', function ( ) {
			
			
		expect(vormCtrl.isPristine()).toBe(modelCtrls.every(function ( ctrl ) {
			return ctrl.$pristine;
		}));
		
		expect(vormCtrl.isDirty()).toBe(modelCtrls.some(function ( ctrl ) {
			return ctrl.$dirty;
		}));
		
	});
	
	it('should set the state of its children', function ( ) {
		
		modelCtrls.forEach(function ( ctrl ) {
			ctrl.$setDirty();
		});
		
		expect(modelCtrls.every(function ( ctrl ) {
			return ctrl.$dirty;
		})).toBe(true);
		
		vormCtrl.setPristine();
		
		expect(modelCtrls.every(function ( ctrl) {
			return ctrl.$pristine;
		})).toBe(true);
		
	});
	
	
});
