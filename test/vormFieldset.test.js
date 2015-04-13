/*global describe,beforeEach,module,inject,describe,it,expect,angular,_*/
describe('vormFieldset', function ( ) {
	
	var scope,
		form,
		setCtrl,
		vormFormCtrl;
	
	beforeEach(module('vorm'));
	
	beforeEach(inject(['$rootScope', '$compile', function (  ) {
		
		var [ $rootScope, $compile ]  = arguments;
		
		scope = $rootScope.$new();
		
		scope.fields = [
			{
				name: 'name',
				type: 'text',
				label: 'Naam'
			},
			{
				name: 'age',
				type: 'number',
				label: 'Age'
			}
		];
		
		form = angular.element(`
			<form vorm-form>
				<vorm-fieldset fields="fields">
				</vorm-fieldset>
			</form>
		`);
		
		$compile(form)(scope);
		
		scope.$digest();
		
		vormFormCtrl = form.controller('vormForm');
		setCtrl = form.find('fieldset').controller('vormFieldset');
		
	}]));
	
	it('should generate vorm-fields', function ( ) {
		
		expect(vormFormCtrl.getFields().length).toBe(scope.fields.length);
	});
	
	it('should hide a field when `when` is false', function ( ) {
		
		scope.fields.push({
			name: 'tel',
			type: 'tel',
			label: 'Telephone',
			when: false
		});
		
		expect(setCtrl.isVisible(_.last(scope.fields))).toBe(false);
		
		scope.$digest();
		
		expect(setCtrl.getFields().length).toBe(3);
		
		expect(vormFormCtrl.getFields().length).toBe(2);
		
	});
	
	it('should show or hide a field when `when` is dependent on values', function ( ) {
		
		let field = {
				name: 'tel',
				type: 'tel',
				label: 'Telephone',
				when: 'name==="foo"'
			},
			fieldCtrl =_.find(vormFormCtrl.getFields(), function ( field ) {
				return field.getName() === 'name';
			});
		
		expect(setCtrl.isVisible(field)).toBe(false);
		
		fieldCtrl.setValue('foo');
		
		scope.$digest();
		
		expect(setCtrl.isVisible(field)).toBe(true);
		
	});
	
});
