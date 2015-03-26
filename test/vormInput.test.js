/*global describe,module*/
describe('vormInput', function ( ) {
	
	let $rootScope,
		$compile;
	
	beforeEach(module('vorm'));
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
	}]));
	
	it('should throw an error if no template or transclude is available', function ( ) {
		
		const element = angular.element(`
			<vorm-input/>
		`);
		
		expect(function ( ) {
			$compile(element)($rootScope.$new());	
		}).toThrow();
		
		
	});
	
	it('should replace itself with the model template from its parent', function ( ) {
		
		const element = angular.element(`
			<div>
				<vorm-field-template name="foo" type="text"/>
			</div>
		`);
		
		$compile(element)($rootScope.$new());
		
		$rootScope.$digest();
		
		expect(element.find('vorm-input').length).toBe(0);
		expect(element.find('input').length).toBe(1);
		
	});
	
	it('should replace itself with the transcluded content', function ( ) {
		
		const element = angular.element(`
			<div>
				<input type="text" ng-model="foo" vorm-field-wrapper/>
			</div>
		`);
		const scope = $rootScope.$new();
		
		scope.foo = 'bar';
		
		$compile(element)(scope);
		
		scope.$digest();
		
		const vormFieldCtrl = element.find('div').inheritedData('$vormFieldController');
		
		expect(element[0].querySelectorAll('[vorm-field]').length).toBe(1);
		
		expect(vormFieldCtrl).toBeDefined();
		
		expect(vormFieldCtrl.getValue()).toBe('bar');
		
	});
	
	it('should support multiple instances of the same type', function ( ) {
		
		const element = angular.element(`
			<div>
				<vorm-field-template name="foo" type="text"></vorm-field-template>
				<vorm-field-template name="bar" type="text"></vorm-field-template>
			</div>
		`);
		
		const scope = $rootScope.$new();
		
		$compile(element)(scope);
		
		scope.$digest();
		
		expect(element.find('input').length).toBe(2);
		
	});
	
});
