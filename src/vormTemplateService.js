/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			let defaultWrapper,
				wrapper,
				modelCompilers,
				modelTemplates = {};
				
			const vormTemplateService = {};
				
			defaultWrapper = `
				<div class="vorm-field"
					ng-class="vormField.getClassObj()"
					vorm-field
				>
					<label class="vorm-field-label" for="{{vormFieldTemplate.getLastInputId()}}">
						{{vormFieldTemplate.getLabel()}}
					</label>
					
					<div class="vorm-input" ng-transclude>
						
					</div>
					
					<div class="vorm-field-status">
						
					</div>
				</div>
			`;
			
			modelTemplates.text = `<input type="text" placeholder="{{vormInput.getData().placeholder}}"/>`;
			modelTemplates.number = `<input type="number"/>`;
			modelTemplates.select = `<select ng-options="option.value as option.label for option in vormInput.getOptions()"><option value="" data-ng-show="vormInput.getInvokedData('notSelectedLabel')">{{vormInput.getInvokedData('notSelectedLabel')}}</option></select>`;
			
			modelTemplates = _.mapValues(modelTemplates, function ( template ) {
				return angular.element(template);
			});	
			
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
					
					
					modelCompilers = _.mapValues(modelTemplates, function ( el ) {
						el.attr('ng-model', 'model.value');
						el.attr('ng-required', 'vormInput.isRequired()');
						return $compile(el);
					});
					
					return vormTemplateService;
					
				}],
				modifyModelTemplates: function ( processor ) {
					modelTemplates = _.mapValues(modelTemplates, function ( template, type ) {
						return processor(template, type);
					});
				}
			};
			
		}]);
	
})();
