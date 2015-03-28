describe('vormInvoke', function ( ) {
	
	let vormInvoke;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject([ 'vormInvoke', function ( ) {
		vormInvoke = arguments[0];
	}]));
	
	it('should return the value if it\'s a primitive', function ( ) {
		
		expect(vormInvoke(true)).toBe(true);
		
		expect(vormInvoke('string')).toBe('string');
		
		expect(vormInvoke()).toBeUndefined();
		
		expect(vormInvoke(null)).toBeNull();
		
	});
	
	it('should return the value if the invokable is an array without a function', function ( ) {
		
		var list = [ 'a', 'b' ];
		
		expect(vormInvoke(list)).toBe(list);
		
	});
	
	it('should return the result of if it\'s a function', function ( ) {
		
		var spy = jasmine.createSpy();
		
		spy.and.returnValue('foo');
		
		expect(vormInvoke(spy)).toBe('foo');
		
		expect(spy).toHaveBeenCalled();
		
	});
	
	it('should invoke the function if it\'s an array', function ( ) {
		
		var spy = jasmine.createSpy();
		
		vormInvoke([ '$value', spy ], { $value: 'foo' });
		
		expect(spy).toHaveBeenCalledWith('foo');
		
	});
	
	it('should throw an error if an unknown service or local is injected', function ( ) {
		
		expect(function ( ) {
			vormInvoke([ '$invalid', spy ], { $value: 'foo'});
		}).toThrow();
		
	});
	
});
