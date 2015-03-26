describe('vormFieldset', function ( ) {
	
	var scope,
		form,
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
		
	}]));
	
	it('should generate vorm-fields', function ( ) {
		
		expect(vormFormCtrl.getFields().length).toBe(scope.fields.length);
	});
	
});
