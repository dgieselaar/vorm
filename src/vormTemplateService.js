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
					'<vorm-replace></vorm-replace>' +
				'</div>';
				
			controlTemplate = 
				'<vorm-control ng-repeat="delegate in vormControlList.getDelegates()">' + 
					'<vorm-control-replace></vorm-control-replace>' + 
					'<button class="vorm-control-clear-button" type="button" ng-click="vormControlList.handleClearClick(delegate)" ng-show="vormControlList.isClearButtonVisible()">x</button>' + 
				'</vorm-control>' + 
				'<vorm-delegate-button>' + 
				'</vorm-delegate-button>';
				
			modelTemplates = _(modelTemplates)
				.assign(
					_('date datetime datetime-local email month number password search tel text time url week checkbox'.split(' '))
						.zipObject()
						.mapValues(function ( value, key ) {
							var placeholder = _.includes('text search tel url email number password'.split(' '), key) ?
								`placeholder="{{vormControl.invokeData('placeholder')}}"`
								: '';
							return `<input type="${key}" ${placeholder}/>`;
						})
						.value()
				)
				.value();
				
			modelTemplates.select = `<select ng-options="option.value as option.label for option in vormControl.getOptions()"><option value="" data-ng-show="vormControl.invokeData('notSelectedLabel')">{{vormControl.invokeData('notSelectedLabel')}}</option></select>`;
			
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
				
				processedEl.find('vorm-control').attr('limit', 'vormFieldConfig.getLimit()');
				
				wrapperTemplate = processedEl[0].outerHTML;
			}
			
			function modifyControlTemplate ( processor ) {
				controlTemplate = processor(angular.element(controlTemplate))[0].outerHTML;
			}
			
			modifyTemplate(function ( ) {
				return angular.element(wrapperTemplate);	
			});
			
			modifyControlTemplate(function ( ) {
				return angular.element(controlTemplate);
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
					
						modelEl.attr('ng-model', 'delegate.value');
						modelEl.attr('ng-required', 'vormControl.isRequired()');
						
						return $compile(el);
					});
					
					return vormTemplateService;
					
				}],
				modifyModelTemplates: modifyModelTemplates,
				modifyControlTemplate: modifyControlTemplate,
				modifyTemplate: modifyTemplate
			};
			
		}]);
	
})();
