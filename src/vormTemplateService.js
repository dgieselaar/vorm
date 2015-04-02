/*global angular,_*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			let wrapperTemplate,
				controlTemplate,
				modelCompilers,
				modelTemplates = {};
				
			const vormTemplateService = {};
			
			wrapperTemplate = '' + 
				'<div ng-class="vormField.getClassObj()">' + 
					'<vorm-label></vorm-label>' + 
					'<vorm-control></vorm-control>' +
				'</div>';
				
			controlTemplate = '<div class="vorm-control-list">' +
				'<div class="vorm-control-list-item" ng-repeat="delegate in vormFieldTemplate.getDelegates()">' + 
					'<vorm-input delegate="delegate" compiler="vormFieldTemplate.getModelCompiler()" data="vormFieldTemplate.getInputData()"></vorm-input>' +
					'<button type="button" ng-click="vormFieldTemplate.clearDelegate(delegate)" ng-show="vormField.getValueType()===\'multiple\'">x</button>' + 
				'</div>' + 
			'</div>';
				
			modelTemplates = _(modelTemplates)
				.assign(
					_('date datetime datetime-local email month number password search tel text time url week checkbox'.split(' '))
						.zipObject()
						.mapValues(function ( value, key ) {
							var placeholder = _.includes('text search tel url email number password'.split(' '), key) ?
								`placeholder="{{vormInput.invoke('placeholder')}}"`
								: '';
							return `<input type="${key}" id="{{::vormInput.getInputId()}}" ${placeholder}/>`;
						})
						.value()
				)
				.value();
				
			modelTemplates.select = `<select id="{{::vormInput.getInputId()}}" ng-options="option.value as option.label for option in vormInput.getOptions()"><option value="" data-ng-show="vormInput.getInvokedData('notSelectedLabel')">{{vormInput.getInvokedData('notSelectedLabel')}}</option></select>`;
			
			modelTemplates = _.mapValues(modelTemplates, function ( template ) {
				return angular.element(template);
			});	
			
			function modifyModelTemplates ( processor ) {
				modelTemplates = _.mapValues(modelTemplates, function ( template, type ) {
					return processor(template, type);
				});
			}
			
			function modifyTemplate ( processor ) {
				const processedEl = processor(angular.element(wrapperTemplate));
				processedEl.attr('vorm-field', '');
				wrapperTemplate = processedEl[0].outerHTML;
			}
			
			modifyTemplate(function ( ) {
				return angular.element(wrapperTemplate);	
			});
			
			
			return {
				$get: [ '$compile', function ( $compile ) {
					
					vormTemplateService.getDefaultTemplate = function ( ) {
						return wrapperTemplate;	
					};
					
					vormTemplateService.getDefaultControlTemplate = function ( ) {
						return controlTemplate;
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
				modifyModelTemplates: modifyModelTemplates,
				modifyTemplate: modifyTemplate
			};
			
		}]);
	
})();
