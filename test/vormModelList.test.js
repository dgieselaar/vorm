/*global describe,beforeEach,module,inject,it,angular,expect,spyOn*/
describe('vormModelList', function ( ) {
	
	var element,
		scope,
		vormModelListCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		var [ $rootScope, $compile ] = arguments;
			
		element = angular.element(`
			<div vorm-model-list>
				<div ng-repeat="model in vormModelList.getDelegates()">
					<input type="text" ng-model="model.value"/>
				</div>
			</div>
		`);
		
		scope = $rootScope.$new();
		
		$compile(element)(scope);
		
		vormModelListCtrl = element.controller('vormModelList');
		
	}]));
	
	it('should have a controller', function ( ) {
		
		expect(vormModelListCtrl).toBeDefined();
		
	});
	
	it('should create a delegate w/ the name foo', function ( ) {
		
		vormModelListCtrl.addDelegate('foo');
		
		expect(vormModelListCtrl.getDelegates().length).toBe(1);
		
		expect(vormModelListCtrl.getDelegates()[0].getName()).toBe('foo');
		
	});
	
	it('should create a delegate w/ the length of the array as name if undefined', function ( ) {
		
		vormModelListCtrl.addDelegate();
		
		expect(vormModelListCtrl.getDelegates()[0].getName()).toBe('0');
		
		vormModelListCtrl.addDelegate();
		
		expect(vormModelListCtrl.getDelegates()[1].getName()).toBe('1');
		
	});
	
	it('should clear the delegate\'s value if it\'s the only one', function ( ) {
		
		var delegate;
		
		vormModelListCtrl.addDelegate('foo');
		
		delegate = vormModelListCtrl.getDelegates()[0];
		delegate.value = 'foo';
		
		spyOn(delegate, 'clearValue');
		
		vormModelListCtrl.clearDelegate(delegate);
		
		expect(delegate.clearValue).toHaveBeenCalled();
		
	});
	
	it('should remove the delegate if it\'s not the only one', function ( ) {
		
		var delegate;
		
		vormModelListCtrl.addDelegate('foo');
		vormModelListCtrl.addDelegate('bar');
		
		delegate = vormModelListCtrl.getDelegates()[1];
		
		vormModelListCtrl.clearDelegate(delegate);
		
		expect(vormModelListCtrl.getDelegates()).not.toContain(delegate);
		
	});
	
});
