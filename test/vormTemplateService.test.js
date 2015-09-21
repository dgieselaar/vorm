import angular from 'angular';
import 'angular-mocks';
import '../src/vorm.js';

describe('vormTemplateService', function ( ) {
	
	let service,
		$rootScope;
	
	describe('with defaults', function ( ) {
		
		beforeEach(angular.mock.module('vorm'));
		
		beforeEach(angular.mock.inject([ '$rootScope', 'vormTemplateService', function ( ) {
			
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
		
		beforeEach(angular.mock.module('vorm', function ( vormTemplateServiceProvider ) {
			
			vormTemplateServiceProvider.modifyModelTemplates(function ( el, type ) {
				
				if(type === 'text') {
					return angular.element(`<custom-input><custom-input/>`);
				}
				
				return el;
			});
			
			vormTemplateServiceProvider.modifyDisplayTemplates(function ( ) {
				return angular.element(`<custom-display/>`);
			});
			
			vormTemplateServiceProvider.modifyTemplate(function ( ) {
				return angular.element(`<custom-template></custom-template>`);
			});
		}));
		
		beforeEach(angular.mock.inject([ '$rootScope', 'vormTemplateService', function ( ) {
			$rootScope = arguments[0];
			service = arguments[1];
		}]));
		
		
		it('should return the modified default model template', function ( ) {
			
			const el = service.getModelCompiler('text')($rootScope.$new());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-input');
			
		});
		
		it('should return the modified default display template', function ( ) {
			
			const el = service.getDisplayCompiler('text')($rootScope.$new());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-display');
			
		});
		
		it('should return the modified default template', function ( ) {
			
			const el = angular.element(service.getDefaultTemplate());
			
			expect(el[0].tagName.toLowerCase()).toBe('custom-template');
			
		});
		
	});
	
	
});
