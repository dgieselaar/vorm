/*global describe,beforeEach,module,inject,it,angular,expect,spyOn*/
describe('vormControlList', function ( ) {
	
	var element,
		scope,
		vormControlListCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		var [ $rootScope, $compile ] = arguments;
			
		element = angular.element(`		                          
			<vorm-field-template config="config">
			</vorm-field-template>
		`);
		
		scope = $rootScope.$new();
		
		scope.config = {
			name: 'test',
			type: 'text',
			valueType: {
				type: 'list',
				limit: 10
			}
		};
		
		$compile(element)(scope);
		
		vormControlListCtrl = element.find('vorm-control-list').controller('vormControlList');
		
	}]));
	
	it('should have a controller', function ( ) {
		
		expect(vormControlListCtrl).toBeDefined();
		
	});
	
	it('should create a delegate w/ the name foo', function ( ) {
		
		vormControlListCtrl.createDelegate('foo');
		
		expect(vormControlListCtrl.getDelegates().length).toBe(1);
		
		expect(vormControlListCtrl.getDelegates()[0].getName()).toBe('foo');
		
	});
	
	it('should create a delegate w/ the length of the array as name if undefined', function ( ) {
		
		vormControlListCtrl.createDelegate();
		
		expect(vormControlListCtrl.getDelegates()[0].getName()).toBe('0');
		
		vormControlListCtrl.createDelegate();
		
		expect(vormControlListCtrl.getDelegates()[1].getName()).toBe('1');
		
	});
	
	it('should clear the delegate', function ( ) {
		
		var delegate;
		
		vormControlListCtrl.createDelegate('foo');
		
		delegate = vormControlListCtrl.getDelegates()[0];
		delegate.value = 'foo';
		
		spyOn(delegate, 'clearViewValue');
		
		vormControlListCtrl.clearDelegate(delegate);
		
		expect(delegate.clearViewValue).toHaveBeenCalled();
		
	});
	
	it('should remove the delegate', function ( ) {
		
		var delegate;
		
		vormControlListCtrl.createDelegate('foo');
		vormControlListCtrl.createDelegate('bar');
		
		delegate = vormControlListCtrl.getDelegates()[1];
		
		vormControlListCtrl.removeDelegate(delegate);
		
		expect(vormControlListCtrl.getDelegates()).not.toContain(delegate);
		
	});
	
});
