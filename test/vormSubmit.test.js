/*global describe, beforeEach,module,inject,angular,spyOn,it,expect,jasmine*/
describe('vormSubmit', function ( ) {
	
	var element,
		$rootScope,
		formScope,
		$compile;
		
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
		element = angular.element(`
			<form vorm-form vorm-submit="handleSubmit($values)">
				<input type="text" ng-model="name"/>
				<input type="text" ng-model="age"/>
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
			
			formScope.name = 'foo';
			formScope.age = 10;
			
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
