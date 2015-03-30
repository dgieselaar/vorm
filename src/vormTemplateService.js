/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			let defaultWrapper,
				defaultTemplate,
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
			
			defaultTemplate = `
				<div class="vorm-input-list">
					<div class="vorm-input-list-item" ng-repeat="delegate in vormFieldTemplate.getDelegates()">
						<vorm-input delegate="delegate" compiler="vormFieldTemplate.getModelCompiler()" data="vormFieldTemplate.getInputData()"></vorm-input>
						<button type="button" ng-click="vormFieldTemplate.clearDelegate(delegate)" ng-show="vormField.getValueType()==='multiple'">x</button>
					</div>
				</div>
			`;
			
			modelTemplates.text = `<input type="text" placeholder="{{vormInput.getData().placeholder}}" id="{{::vormInput.getInputId()}}"/>`;
			modelTemplates.number = `<input type="number" id="{{::vormInput.getInputId()}}"/>`;
			modelTemplates.select = `<select id="{{::vormInput.getInputId()}}" ng-options="option.value as option.label for option in vormInput.getOptions()"><option value="" data-ng-show="vormInput.getInvokedData('notSelectedLabel')">{{vormInput.getInvokedData('notSelectedLabel')}}</option></select>`;
			
			modelTemplates = _.mapValues(modelTemplates, function ( template ) {
				return angular.element(template);
			});	
			
			return {
				$get: [ '$compile', function ( $compile ) {
					
					vormTemplateService.getDefaultWrapper = function ( ) {
						return defaultWrapper;	
					};
					
					vormTemplateService.getDefaultTemplate = function ( ) {
						return defaultTemplate;	
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
						let modelEl;
						
						_.some(el, function ( element ) {
							
							let childEl;
							
							if(element.hasAttribute('ng-model')) {
								modelEl = angular.element(element);
							} else if((childEl = element.querySelector('[ng-model]'))) {
								modelEl = angular.element(childEl);
							}
							
							return !!modelEl;
							
						});
							
						if(!modelEl) {
							modelEl = el;
						}
					
						modelEl.attr('ng-model', 'model.value');
						modelEl.attr('ng-required', 'vormInput.isRequired()');
						
						return $compile(el);
					});
					
					return vormTemplateService;
					
				}],
				modifyModelTemplates: function ( processor ) {
					modelTemplates = _.mapValues(modelTemplates, function ( template, type ) {
						return processor(template, type);
					});
				},
				modifyDefaultWrapper: function ( processor ) {
					const processedEl = processor(angular.element(defaultWrapper));
					processedEl.attr('vorm-field', '');
					defaultWrapper = processedEl[0].outerHTML;
				},
				modifyDefaultTemplate: function ( processor ) {
					const processedEl = processor(angular.element(defaultTemplate));
					let el = angular.element('<p></p>');
					el.append(processedEl);
					defaultTemplate = el[0].innerHTML;
				}
			};
			
		}]);
	
})();
