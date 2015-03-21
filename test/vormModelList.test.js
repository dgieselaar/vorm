/*global describe,beforeEach,module,inject,it,angular,expect*/
describe('vormModelList', function ( ) {
	
	var vormModelListCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ '$rootScope', '$compile', function ( ) {
		
		var [ $rootScope, $compile ] = arguments,
			el;
			
		el = angular.element(`<div vorm-model-list></div>`);
		
		$compile(el)($rootScope.$new());
		
		vormModelListCtrl = el.inheritedData('$vormModelListController');
		
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
		
		vormModelListCtrl.clearDelegate(delegate);
		
		expect(delegate.value).toBeUndefined();
		
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
