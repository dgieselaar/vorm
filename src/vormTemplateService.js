/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			let defaultWrapper,
				wrapper,
				modelCompilers;
				
			const vormTemplateService = {},
				modelTemplates = {};
				
			defaultWrapper = `
				<div class="vorm-field"
					ng-class="vormField.getClassObj()"
					vorm-field
				>
					<div class="vorm-field-label">
						{{vormFieldTemplate.getLabel()}}
					</div>
					
					<div class="vorm-input" ng-transclude>
						
					</div>
					
					<div class="vorm-field-status">
						
					</div>
				</div>
			`;
			
			modelTemplates.text = `<input type="text" placeholder="{{vormFieldTemplate.getInputData().placeholder}}"/>`;
			modelTemplates.number = `<input type="number"/>`;
					
			
			return {
				$get: [ '$compile', function ( $compile ) {
					
					vormTemplateService.getDefaultTemplate = function ( ) {
						return defaultWrapper;	
					};
					
					vormTemplateService.getModelCompiler = function ( type, template ) {
						
						let compiler;
						
						if(template) {
							compiler = $compile(template);
						} else {
							compiler = modelCompilers[type];
						}
						
						if(!compiler) {
							throw new Error(`Model template for ${type} not found`);
						}
						
						return compiler;
					};
					
					
					modelCompilers = _.mapValues(modelTemplates, function ( tpl ) {
						const el = angular.element(tpl);
						el.attr('ng-model', 'model.value');
						el.attr('ng-required', 'vormInput.isRequired()');
						return $compile(el);
					});
					
					return vormTemplateService;
					
				}],
			};
			
		}]);
	
})();
