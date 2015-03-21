/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			var vormTemplateService = {},
				defaultWrapper,
				modelTemplates = {},
				modelCompilers = {},
				wrapper;
				
			defaultWrapper = `
				<div class="vorm-field"
					ng-class="vormField.getClassObj()"
					vorm-field
					vorm-model-list
					>
					<div class="vorm-field-label">
						{{vormFieldTemplate.getLabel()}}
					</div>
					
					<ul class="vorm-input-list">
						<li class="vorm-input" ng-repeat="model in vormModelList.getModelDelegates()">
							<vorm-input data-type="vormFieldTemplate.getInputType()" data-config="vormFieldTemplate.getInputData()" model-delegate="model"></vorm-input>
							<button class="vorm-input-clear" type="button" ng-click="vormModelList.clearModelDelegate(model)">
							</button>
						</li>
					</ul>
					
					<div class="vorm-field-status">
						
					</div>
				</div>
			`;
			
			modelTemplates.text = `<input type="text" placeholder="{{vormFieldTemplate.getPlaceholder()}}"/>`;
					
			
			return {
				$get: function ( $compile ) {
					
					
					
					vormTemplateService.getDefaultTemplate = function ( ) {
						return defaultWrapper;	
					};
					
					vormTemplateService.getModelCompiler = function ( type, template ) {
						
						var compiler;
						
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
						var el = angular.element(tpl);
						el.attr('ng-model', 'model.value');
						return $compile(el);
					});
					
					return vormTemplateService;
					
				},
				$inject: [ '$compile' ]
			};
			
		}]);
	
})();
