/*global describe,beforeEach,module,inject,it,angular,expect,spyOn,jasmine*/
describe('vormControlList', function ( ) {
	
	var element,
		scope,
		vormFieldCtrl,
		vormControlListCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', '$document', function ( ) {
		
		var [ $rootScope, $compile, $document ] = arguments;
			
		element = angular.element(`		                          
			<vorm-field-template config="config">
			</vorm-field-template>
		`);
		
		$document.find('body').append(element);
		
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
		
		vormFieldCtrl = element.controller('vormField');
		
		vormControlListCtrl = element.find('vorm-control-list').controller('vormControlList');
		
		scope.$digest();
		
	}]));
	
	it('should have a controller', function ( ) {
		
		expect(vormControlListCtrl).toBeDefined();
		
	});
	
	it('should have a delegate', function ( ) {
		
		expect(vormControlListCtrl.getDelegates().length).toBe(1);
	});
	
	it('should create a delegate w/ the name foo', function ( ) {
		
		vormControlListCtrl.createDelegate('foo');
		
		expect(vormControlListCtrl.getDelegates().length).toBe(2);
		
		expect(vormControlListCtrl.getDelegates()[1].getName()).toBe('foo');
		
	});
	
	it('should create a delegate w/ the length of the array as name if undefined', function ( ) {
		
		vormControlListCtrl.createDelegate();
		
		expect(vormControlListCtrl.getDelegates()[1].getName()).toBe('1');
		
		vormControlListCtrl.createDelegate();
		
		expect(vormControlListCtrl.getDelegates()[2].getName()).toBe('2');
		
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
	
	it('should set the limit to what is defined', function ( ) {
		
		vormControlListCtrl.setLimit(10);
		
		expect(vormControlListCtrl.getLimit()).toBe(10);
		
	});
	
	it('should tell when the limit is reached', function ( ) {
		
		vormControlListCtrl.setLimit(2);
		
		expect(vormControlListCtrl.reachedLimit()).toBe(false);
		
		vormControlListCtrl.createDelegate();
		
		expect(vormControlListCtrl.reachedLimit()).toBe(true);
		
	});
	
	it('should create a delegate on click', function ( ) {
		
		expect(vormControlListCtrl.getDelegates().length).toBe(1);
		
		vormControlListCtrl.handleCreateClick();
		
		expect(vormControlListCtrl.getDelegates().length).toBe(2);
		
	});
	
	it('should create a delegate on click', function ( ) {
		
		expect(vormControlListCtrl.getDelegates().length).toBe(1);
		
		vormControlListCtrl.handleCreateClick();
		
		expect(vormControlListCtrl.getDelegates().length).toBe(2);
		
	});
	
	it('should clear the control on clear click if it\'s the last one', function ( ) {
		
		var delegate = vormControlListCtrl.getDelegates()[0];
		
		expect(vormControlListCtrl.getDelegates().length).toBe(1);
		
		spyOn(delegate, 'clearViewValue').and.callThrough();
		
		vormControlListCtrl.handleClearClick(delegate);
		
		expect(delegate.clearViewValue).toHaveBeenCalled();
		
	});
	
	it('should remove the control on clear click if there\'s more than one left', function ( ) {
		
		vormControlListCtrl.createDelegate();
		
		var delegate = vormControlListCtrl.getDelegates()[1];
		
		expect(vormControlListCtrl.getDelegates().length).toBe(2);
		
		spyOn(delegate, 'clearViewValue').and.callThrough();
		
		vormControlListCtrl.handleClearClick(delegate);
		
		expect(delegate.clearViewValue).not.toHaveBeenCalled();
		
		expect(vormControlListCtrl.getDelegates()).not.toContain(delegate);
		
	});
	
	it('should trigger a view change', function ( ) {
		
		var spy = jasmine.createSpy();
		
		vormFieldCtrl.viewChangeListeners.push(spy);
		
		vormControlListCtrl.handleCreateClick();
		
		scope.$digest();
		
		expect(spy).toHaveBeenCalled();
		
	});
	
});
