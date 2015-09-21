import angular from 'angular';
import 'angular-mocks';
import '../src/vorm';

describe('vormSubmit', function ( ) {
	
	var element,
		$rootScope,
		formScope,
		$compile;
		
	beforeEach(angular.mock.module('vorm'));
	
	beforeEach(angular.mock.inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
		element = angular.element(`
			<form vorm-form vorm-submit="handleSubmit($values)">
				<input type="text" ng-model="values.name" name="name"/>
				<input type="text" ng-model="values.age" name="age"/>
			</form>
		`);
		
		formScope = $rootScope.$new();
		formScope.handleSubmit = function ( ) {};
		
		$compile(element)(formScope);
		$rootScope.$digest();
		
	}]));
	
	describe('when submitted', function ( ) {
		
		it('should call the handler', function ( ) {
			
			spyOn(formScope, 'handleSubmit');
			
			element.triggerHandler('submit');
			
			expect(formScope.handleSubmit).toHaveBeenCalled();
			
		});
		
		it('should call the handler with the correct values', function ( ) {
			
			spyOn(formScope, 'handleSubmit');
			
			formScope.values = {name: 'foo', age: 10 };
			
			formScope.$digest();
			
			element.triggerHandler('submit');
			
			expect(formScope.handleSubmit)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					name: 'foo',
					age: 10
				}));
			
		});
		
	});
	
});
