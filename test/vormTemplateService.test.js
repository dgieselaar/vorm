/*global describe,beforeEach,module,inject,expect,it,angular*/
describe('vormTemplateService', function ( ) {
	
	let service,
		$rootScope;
	
	describe('with defaults', function ( ) {
		
		beforeEach(module('vorm'));
		
		beforeEach(inject([ '$rootScope', 'vormTemplateService', function ( ) {
			
			$rootScope = arguments[0];
			service = arguments[1];
			
		}]));
		
		it('should return the default compiler for the specified type', function ( ) {
			
			const compiler = service.getModelCompiler('text');
			
			expect(compiler).toBeDefined();
			
			const el = compiler($rootScope.$new());
			
			expect(el[0].tagName.toLowerCase()).toBe('input');
			
		});
		
		it('should return a custom compiler if specified', function ( ) {
			
			const tpl = `
				<custom-element></custom-element>
			`;
			
			const compiler = service.getModelCompiler('text', tpl);
			
			expect(compiler).toBeDefined();
			expect(compiler).not.toBe(service.getModelCompiler('text'));
			
			const el = compiler($rootScope.$new());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-element');
			
		});
		
		it('should throw an error if no compiler is available for that type', function ( ) {
			
			expect(function ( ) {
				service.getModelCompiler('foo');
			}).toThrow();
			
		});
	});
	
	describe('with modifications', function ( ) {
		
		beforeEach(module('vorm', function ( vormTemplateServiceProvider ) {
			
			vormTemplateServiceProvider.modifyModelTemplates(function ( el, type ) {
				
				if(type === 'text') {
					return angular.element(`<custom-input><custom-input/>`);
				}
				
				return el;
			});
			
			vormTemplateServiceProvider.modifyDefaultWrapper(function ( ) {
				return angular.element(`<custom-wrapper></custom-wrapper>`);
			});
			
			vormTemplateServiceProvider.modifyDefaultTemplate(function ( ) {
				return angular.element(`<custom-template></custom-template>`);
			});
			
		}));
		
		beforeEach(inject([ '$rootScope', 'vormTemplateService', function (  ) {
			$rootScope = arguments[0];
			service = arguments[1];
		}]));
		
		
		it('should return the modified default model template', function ( ) {
			
			const el = service.getModelCompiler('text')($rootScope.$new());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-input');
			
		});
		
		it('should return the modified default wrapper', function ( ) {
			
			const el = angular.element(service.getDefaultWrapper());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-wrapper');
			
		});
		
		it('should return the modified default template', function ( ) {
			
			const el = angular.element(service.getDefaultTemplate());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-template');
			
		});
		
	});
	
	
});
