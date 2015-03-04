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
			<form vorm-form vorm-change="handleFormChange($name)">
				<input type="text" ng-model="name" vorm-change="handleNameChange()"/>
			</form>
		`);
		
		formScope = $rootScope.$new();
		formScope.handleFormChange = function ( ) {};
		formScope.handleNameChange = function ( ) {};
		
		$compile(element)(formScope);
		$rootScope.$digest();
		
	}]));
	
	describe('when changed', function ( ) {
		
		it('should call the individual handler', function ( ) {
			
			spyOn(formScope, 'handleNameChange');
			
			element.find('input').triggerHandler('vormchange', 'name');
			
			expect(formScope.handleNameChange).toHaveBeenCalled();
			
		});
		
		it('should call the form handler', function ( ) {
			
			spyOn(formScope, 'handleFormChange');
			
			element.triggerHandler('vormchange', 'name');
			
			expect(formScope.handleFormChange)
				.toHaveBeenCalledWith('name');
			
		});
		
	});
	
});
