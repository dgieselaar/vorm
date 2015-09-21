import angular from 'angular';
import _ from 'lodash';
	
angular.module('vorm')
	.provider('vormTemplateService', [ function ( ) {
		
		let wrapperTemplate,
			controlTemplate,
			compilers = { model: {}, display: {} },
			templates = { model: {}, display: { null: angular.element('<span>{{vormDisplay.getViewValue()}}</span>') } };
			
		const vormTemplateService = {};
		
		wrapperTemplate =
			`<div ng-class="vormField.getClassObj()">
				<vorm-label></vorm-label>
				<vorm-replace></vorm-replace>
			</div>`;
			
		controlTemplate =
			`<vorm-control-list>
				<vorm-control ng-repeat="delegate in vormControlList.getDelegates()" delegate="delegate">
					<vorm-edit ng-show="vormControl.getDisplayMode()==='edit'">
						<vorm-control-replace></vorm-control-replace>
						<button class="vorm-control-clear-button" type="button" ng-click="vormControlList.handleClearClick(delegate)" ng-show="vormControlList.isClearButtonVisible()">x</button>
					</vorm-edit>
					<vorm-display ng-show="vormControl.getDisplayMode()==='display'"></vorm-display>
				</vorm-control>
				<vorm-delegate-button>
				</vorm-delegate-button>
			</vorm-control-list>`;
		
		function modifyModelTemplates ( processor ) {
			templates.model = _.mapValues(templates.model, function ( template, type ) {
				return processor(template, type);
			});
		}
		
		function modifyDisplayTemplates ( processor ) {
			templates.display = _.mapValues(templates.display, function ( template, type ) {
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
			const wrapper = angular.element('<p></p>');
			wrapper.append(processor(angular.element(controlTemplate)));
			controlTemplate = wrapper[0].innerHTML;
		}
		
		function registerType ( type, modelTemplate, displayTemplate ) {
			templates.model[type] = modelTemplate;
			if(displayTemplate) {
				templates.display[type] = displayTemplate;
			}
		}
		
		modifyTemplate(function ( ) {
			return angular.element(wrapperTemplate);
		});
		
		modifyControlTemplate(function ( ) {
			return angular.element(controlTemplate);
		});
		
		
		return {
			$get: [ '$compile', function ( $compile ) {
				
				function getCompiler ( type, controlType, template ) {
					let compiler,
						pool = compilers[type];
							
					if(template) {
						compiler = $compile(template);
					} else {
						compiler = pool[controlType];
					}
					
					if(!compiler && type === 'display') {
						compiler = getCompiler(type, null);
					}
					
					if(!compiler) {
						throw new Error(`${_.capitalize(type)} template for ${controlType} not found`);
					}
					
					return compiler;
				}
				
				vormTemplateService.getDefaultTemplate = function ( ) {
					return wrapperTemplate;
				};
				
				vormTemplateService.getDefaultControlTemplate = function ( ) {
					return controlTemplate;
				};
				
				vormTemplateService.getModelCompiler = function ( type, template ) {
					return getCompiler('model', type, template);
				};
				
				vormTemplateService.getDisplayCompiler = function ( type, template ) {
					return getCompiler('display', type, template);
				};
				
				compilers.model = _.mapValues(templates.model, function ( el ) {
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
					modelEl.attr('name', '{{delegate.getName()}}');
					modelEl.attr('ng-required', 'vormControl.isRequired()');
					
					return $compile(el);
				});
				
				compilers.display = _.mapValues(templates.display, function ( el ) {
					return $compile(el);
				});
				
				return vormTemplateService;
				
			}],
			modifyModelTemplates: modifyModelTemplates,
			modifyDisplayTemplates: modifyDisplayTemplates,
			modifyControlTemplate: modifyControlTemplate,
			modifyTemplate: modifyTemplate,
			registerType: registerType
		};
		
	}]);
