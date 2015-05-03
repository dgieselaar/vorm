'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

/*global require*/

(function () {

	/**
  * @ngdoc module
  * @name vorm
  * @module vorm
  * @description
  
  * The `vorm` module is the core and currently only module for vorm.
  *
  */

	angular.module('vorm', []);
})();

/*global angular*/
(function () {

	angular.module('vorm').factory('VormEvent', ['$document', '$window', function ($document, $window) {

		var VormEvent = undefined;

		try {
			var _event = new $window.CustomEvent('foo'); // jshint ignore:line
			VormEvent = function (type, data) {
				return new $window.CustomEvent(type, {
					detail: data,
					bubbles: true
				});
			};
		} catch (error) {
			VormEvent = function (type, data) {
				var event = $document[0].createEvent('CustomEvent');
				event.initCustomEvent(type, true, true, data);
				return event;
			};
		}

		return VormEvent;
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').factory('VormFieldCtrl', ['$rootScope', 'VormEvent', 'VormValueType', 'VormValueScope', function ($rootScope, VormEvent, VormValueType, VormValueScope) {

		return function (name, element) {

			var ctrl = {},
			    models = [],
			    viewChangeListeners = [],
			    modelChangeListeners = [],
			    prefix = 'vorm-field-';

			var valueType = VormValueType.SINGLE,
			    required = undefined,
			    valueScope = new VormValueScope();

			function getDefaultValue() {
				var defaults = undefined;
				switch (valueType) {
					case VormValueType.SINGLE:
						defaults = null;
						break;

					case VormValueType.LIST:
						defaults = [null];
						break;

					case VormValueType.NAMED:
						defaults = {};
						break;
				}
				return defaults;
			}

			function setModelValue(model, value) {
				// $$writeModelToScope calls the view listeners
				// and we don't really want that
				var $viewChangeListeners = model.$viewChangeListeners;
				var $modelValue = model.$modelValue;

				model.$viewChangeListeners = [];
				model.$modelValue = value;
				model.$$writeModelToScope();

				// reset all the things
				model.listeners = $viewChangeListeners;
				model.$modelValue = $modelValue;
			}

			function applyValueToControls() {
				var value = valueScope[name];
				switch (valueType) {
					case VormValueType.SINGLE:
						if (models[0]) {
							setModelValue(models[0], value);
						}
						break;

					case VormValueType.LIST:
						_.each(models, function (model, index) {
							setModelValue(model, value[index]);
						});
						break;

					case VormValueType.NAMED:
						var modelsToChange = models.concat();
						_.each(value, function (val, key) {
							var model = _.find(models, { $name: key });
							if (model) {
								setModelValue(model, val);
							}
							_.pull(modelsToChange, model);
						});

						_.each(modelsToChange, function (model) {
							setModelValue(model, undefined);
						});
						break;
				}
			}

			function getModelValue() {
				var value = undefined;

				switch (valueType) {
					case VormValueType.SINGLE:
						value = models[0] ? models[0].$modelValue : undefined;
						break;

					case VormValueType.LIST:
						value = _.pluck(models, '$modelValue');
						break;

					case VormValueType.NAMED:
						value = {};
						_.each(models, function (model) {
							value[model.$name] = model.$modelValue;
						});
						break;
				}

				return value;
			}

			function handleViewChange() {
				// value changes from view
				valueScope[name] = getModelValue();
				ctrl.triggerViewChange();
			}

			function handleFormatterCall(value) {
				// value changes from model
				var modelValue = getModelValue();
				valueScope[name] = modelValue;
				ctrl.triggerModelChange();
				return value;
			}

			ctrl.triggerModelChange = function () {
				element.dispatchEvent(new VormEvent('modelchange', { name: name }));
				_.invoke(modelChangeListeners, 'call', null, name);
			};

			ctrl.triggerViewChange = function () {
				element.dispatchEvent(new VormEvent('viewchange', { name: name }));
				_.invoke(viewChangeListeners, 'call', null, name);
			};

			ctrl.getName = function () {
				return name;
			};

			ctrl.setName = function () {
				name = arguments[0];
			};

			ctrl.addModel = function (model) {
				models.push(model);
				model.$viewChangeListeners.push(handleViewChange);
				model.$formatters.push(handleFormatterCall);
				valueScope[name] = getModelValue();
			};

			ctrl.removeModel = function (model) {
				_.pull(models, model);
				_.pull(model.$viewChangeListeners, handleViewChange);
				_.pull(model.$formatters, handleFormatterCall);
				valueScope[name] = getModelValue();
			};

			ctrl.getModels = function () {
				return models;
			};

			ctrl.getValue = function () {
				return valueScope[name];
			};

			ctrl.getValueType = function () {
				return valueType;
			};

			ctrl.setValueType = function (type) {
				if ([VormValueType.SINGLE, VormValueType.LIST, VormValueType.NAMED].indexOf(type) === -1) {
					throw new Error('Unsupported VormValueType: ' + VormValueType);
				}

				valueType = type;
				valueScope[name] = getDefaultValue();
			};

			ctrl.setValue = function (value) {
				valueScope[name] = value;
				applyValueToControls();
			};

			ctrl.setEmpty = function () {
				valueScope[name] = getDefaultValue();
			};

			ctrl.isRequired = function () {
				return required;
			};

			ctrl.setRequired = function (r) {
				required = !!r;
			};

			ctrl.isEmpty = function () {
				return models.every(function (model) {
					return model.$isEmpty(model.$viewValue);
				});
			};

			ctrl.setValueScope = function (scope) {
				var val = valueScope[name];
				if (valueScope) {
					valueScope.$destroy();
				}

				valueScope = scope;
				valueScope[name] = val;
			};

			ctrl.getValueScope = function () {
				return valueScope;
			};

			var chain = _('valid invalid dirty pristine touched untouched required empty'.split(' ')).map(function (key) {
				return prefix + key;
			}).zipObject().mapValues(function (value, key) {
				var m = key.substr(prefix.length);
				return ctrl['is' + _.capitalize(m)]();
			});

			ctrl.getClassObj = function () {
				return chain.value();
			};

			ctrl.setEmpty();

			ctrl.viewChangeListeners = viewChangeListeners;
			ctrl.modelChangeListeners = modelChangeListeners;

			'valid invalid dirty pristine touched untouched'.split(' ').forEach(function (type) {
				var capitalized = _.capitalize(type),
				    getName = 'is' + capitalized,
				    propertyName = '$' + type,
				    setName = 'set' + capitalized,
				    method = ['valid', 'pristine', 'untouched'].indexOf(type) !== -1 ? 'every' : 'some';

				ctrl[getName] = function () {
					return models[method](function (model) {
						return model[propertyName];
					});
				};

				if (type !== 'valid' && type !== 'invalid') {
					ctrl[setName] = function () {
						var outerArgs = arguments;

						models.forEach(function (model) {
							model['$' + setName].apply(model, outerArgs);
						});
					};
				}
			});

			valueScope[name] = getDefaultValue();

			return ctrl;
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').factory('VormModelDelegate', [function () {

		return function (name) {

			var delegate = {};
			var ngModel = null;

			delegate.value = null;

			delegate.getName = function () {
				return name;
			};

			delegate.setNgModel = function (model) {
				ngModel = model;
				if (ngModel) {
					ngModel.$name = name;
				}
			};

			delegate.unsetNgModel = function () {
				ngModel = null;
			};

			delegate.getNgModel = function () {
				return ngModel;
			};

			delegate.clearViewValue = function () {
				ngModel.$setViewValue(null);
				ngModel.$render();
			};

			delegate.getViewValue = function () {
				return ngModel ? ngModel.$viewValue : delegate.value;
			};

			return delegate;
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').factory('VormValueScope', ['$rootScope', function ($rootScope) {

		return function () {

			var scope = $rootScope.$new();

			return scope;
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').constant('VormValueType', {
		SINGLE: 'single',
		LIST: 'list',
		NAMED: 'named'
	});
})();

/*global angular*/
(function () {

	/**
  * @ngdoc directive
  * @name ngModel
  * @module vorm
  * @description
  
  * This overloads the `ngModel` directive, and registers the `ngModelController`
  * with the `vormFieldController` and the `vormFormController` if they're there.
  
  * __Requires__: `ngModel`, `^?vormField`, `^?vormForm`
  */

	angular.module('vorm').directive('ngModel', ['VormFieldCtrl', function (VormFieldCtrl) {

		return {
			require: ['ngModel', '^?vormField', '^?vormForm'],
			compile: function compile() {
				return function link(scope, element, attrs, controllers) {
					var _controllers = _slicedToArray(controllers, 3);

					var ngModel = _controllers[0];
					var vormField = _controllers[1];
					var vorm = _controllers[2];

					if (vormField || vorm) {

						if (!vormField) {
							vormField = new VormFieldCtrl(attrs.name || attrs.ngModel, element[0]);

							if (vorm) {
								vorm.addField(vormField);
								scope.$on('$destroy', function () {
									vorm.removeField(vormField);
								});
							}
						}

						vormField.addModel(ngModel);

						scope.$on('$destroy', function () {
							vormField.removeModel(ngModel);
						});
					}
				};
			}
		};
	}]);
})();

/*global angular*/
(function () {

	/**
  * @ngdoc directive
  * @name vormChange
  * @module vorm
  * @description
  
  Evaluate the given expression when a value changes from the view.
  It listens to a viewchange event, which is dispatched from a 
  `vormFieldController` and then bubbles upwards.
  */

	angular.module('vorm').directive('vormChange', ['$parse', function ($parse) {

		return {
			link: function link(scope, element, attrs) {

				var cb = $parse(attrs.vormChange);

				function handleChange(event, name) {
					cb(scope, {
						$event: event,
						$name: event.detail ? event.detail.name : name
					});
				}

				element.bind('viewchange', handleChange);
			}
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').directive('vormControl', ['$document', function ($document) {

		var matchesFuncName = (function () {

			var element = $document[0].createElement('div');

			return _(['', 'ms', 'moz', 'webkit']).map(function (prefix) {
				return prefix ? prefix + 'MatchesSelector' : 'matches';
			}).find(function (name) {
				return name in element;
			});
		})();

		return {
			restrict: 'E',
			require: ['vormControl', '^vormField', '^vormFieldConfig', '^vormFocusableList', '^vormFieldTemplate'],
			controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

				var ctrl = this,
				    vormField,
				    vormFieldConfig,
				    vormFocusableList,
				    vormFieldTemplate,
				    inputId = Math.random().toString(36).slice(2);

				ctrl.link = function (controllers) {
					vormField = controllers[0];
					vormFieldConfig = controllers[1];
					vormFocusableList = controllers[2];
					vormFieldTemplate = controllers[3];

					ctrl.invokeData = vormFieldConfig.invokeData;
					ctrl.getData = vormFieldConfig.getData;
					ctrl.getConfig = vormFieldConfig.getConfig;

					vormFocusableList.addId(inputId);

					vormFieldTemplate.getModelCompiler()($scope, function (clonedElement) {

						var focusable = undefined,
						    selector = 'input,keygen,meter,output,progress,select,textarea',
						    replace = $element.find('vorm-control-replace'),
						    delegate = $scope.$eval($attrs.delegate);

						replace.replaceWith(clonedElement);

						clonedElement[0].className += ' ' + replace[0].className;

						if (clonedElement[0][matchesFuncName](selector)) {
							focusable = clonedElement;
						} else {
							focusable = angular.element(clonedElement[0].querySelector(selector));
						}

						focusable.attr('id', ctrl.getInputId());

						$scope.$$postDigest(function () {
							delegate.setNgModel(clonedElement.controller('ngModel'));
						});

						$scope.$on('$destroy', function () {
							delegate.unsetNgModel();
						});
					});
				};

				ctrl.isRequired = function () {
					return vormField && vormField.isRequired();
				};

				ctrl.getInputId = function () {
					return inputId;
				};

				ctrl.getViewValue = function () {
					return $scope.$eval($attrs.delegate).getViewValue();
				};

				ctrl.getDisplayMode = function () {
					return vormFieldConfig.getDisplayMode();
				};

				if (angular.version.minor >= 4) {
					// dynamic options throws an error in <=1.3.x
					// fixed in 1.4.x
					// https://github.com/angular/angular.js/pull/10639
					ctrl.getOptions = function () {
						return ctrl.invokeData('options');
					};
				} else {
					ctrl.getOptions = (function () {

						var options = undefined;

						return function () {
							var nwOpts = ctrl.invokeData('options');
							if (options !== nwOpts && !angular.equals(options, nwOpts)) {
								options = nwOpts;
							}

							return options;
						};
					})();
				}

				$scope.$on('$destroy', function () {
					vormFocusableList.removeId(inputId);
				});
			}],
			controllerAs: 'vormControl',
			link: function link(scope, element, attrs, controllers) {
				controllers[0].link(controllers.slice(1));
			}
		};
	}]);
})();

/*global angular,_*/
(function () {

	/**
 
 @ngdoc directive
 @name vormControlList
 @module vorm
 
 @description
  
 This directives manages and displays the available controls.
 	 
  __Requires__: `^vormFieldConfig`, `^?vormFocusableList`, `vormField`
        
 */

	/**
 
 @ngdoc type
 @name vormControlList.controller
 @module vorm
        
 */

	angular.module('vorm').directive('vormControlList', ['VormModelDelegate', '$document', function (VormModelDelegate, $document) {

		return {
			require: ['vormControlList', '^vormFieldConfig', '^?vormFocusableList', '^vormField'],
			restrict: 'E',
			controller: ['$scope', function ($scope) {

				var ctrl = this,
				    delegates = [],
				    limit = NaN,
				    vormFieldConfig = undefined,
				    vormFocusableList = undefined,
				    vormField = undefined;

				function triggerAsyncViewChange(callback) {
					var unwatch = $scope.$watchCollection(vormField.getModels, function () {

						vormField.triggerViewChange();

						callback();

						unwatch();
					});
				}

				function setFocus() {
					if (vormFocusableList) {
						var id = vormFocusableList.getId(),
						    el = $document[0].getElementById(id);

						if (el) {
							el.focus();
						}
					}
				}

				function createDelegate(name) {
					var delegate = undefined,
					    value = undefined;

					delegate = new VormModelDelegate(name);

					switch (vormField.getValueType()) {
						case 'list':
							value = vormField.getValue()[delegates.length];
							break;

						case 'named':
							value = vormField.getValue()[name];
							break;

						case 'single':
							value = vormField.getValue();
							break;
					}

					delegate.value = value;
					delegates.push(delegate);
				}

				ctrl.link = function (controllers) {

					vormFieldConfig = controllers[0];
					vormFocusableList = controllers[1];
					vormField = controllers[2];

					$scope.$watch(vormFieldConfig.getLimit, function (limit) {
						ctrl.setLimit(limit);
					});

					$scope.$watchCollection(function () {
						var keys = undefined,
						    val = vormField.getValue();

						switch (vormField.getValueType()) {
							default:
								keys = _.keys(val);
								break;

							case 'single':
								keys = null;
								break;
						}

						return keys;
					}, function (keys) {

						delegates = [];

						if (!keys) {
							createDelegate();
						}

						_.each(keys, function (key) {
							createDelegate(key);
						});
					});
				};

				/**
     * @ngdoc method
     * @name vormControlList.controller#$getDelegates
     *
     * @description
     
     Returns the list of the model delegates that are registered with the controller.
     
     * @returns {Array.<VormModelDelegate>} A list of the registered model delegates.
     */

				ctrl.getDelegates = function () {
					return delegates;
				};

				ctrl.clearDelegate = function (delegate) {
					delegate.clearViewValue();
				};

				ctrl.getLimit = function () {
					return limit;
				};

				ctrl.setLimit = function (l) {
					limit = Number(l);
				};

				ctrl.reachedLimit = function () {
					return limit > 0 && delegates.length >= limit;
				};

				ctrl.isClearButtonVisible = function () {
					return vormField.getValueType() === 'list';
				};

				ctrl.handleCreateClick = function () {
					vormField.setValue(vormField.getValue().concat(null));
					triggerAsyncViewChange(setFocus);
				};

				ctrl.handleClearClick = function (delegate) {

					if (delegates.length === 1) {
						delegate.clearViewValue();
					} else {
						var value = vormField.getValue(),
						    index = _.find(vormField.getModels(), { model: delegate.getNgModel() });

						value.splice(index, 1);
						vormField.setValue(value);

						triggerAsyncViewChange(setFocus);
					}
				};
			}],
			controllerAs: 'vormControlList',
			link: function link(scope, element, attrs, controllers) {

				controllers.shift().link(controllers);
			}
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormDelegateButton', [function () {

		return {
			require: ['vormDelegateButton', '^vormFieldConfig', '^vormControlList', '^vormField'],
			template: '<button class="vorm-delegate-button" type="button" ng-click="vormDelegateButton.handleClick()" ng-disabled="vormDelegateButton.isDisabled()" ng-show="vormDelegateButton.isVisible()">' + '{{vormDelegateButton.getLabel()}}' + '</button>',
			replace: true,
			controller: [function () {

				var ctrl = this,
				    vormFieldConfig = undefined,
				    vormControlList = undefined,
				    vormField = undefined;

				ctrl.link = function (controllers) {
					vormFieldConfig = controllers[0];
					vormControlList = controllers[1];
					vormField = controllers[2];
				};

				ctrl.handleClick = function () {
					vormControlList.handleCreateClick();
				};

				ctrl.isDisabled = function () {
					return vormControlList.reachedLimit();
				};

				ctrl.isVisible = function () {
					return vormField.getValueType() === 'list';
				};

				ctrl.getLabel = function () {
					var config = vormFieldConfig.getConfig(),
					    typeOptions = config ? config.valueType : null,
					    addLabel = typeOptions && typeOptions.addLabel ? vormFieldConfig.invoke(typeOptions.addLabel) : '';

					return addLabel;
				};
			}],
			link: function link(scope, element, attrs, controllers) {

				controllers.shift().link(controllers);
			},
			controllerAs: 'vormDelegateButton'
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormDisplay', ['vormTemplateService', function (vormTemplateService) {

		return {
			restrict: 'E',
			require: ['vormDisplay', '^vormControl', '^vormFieldConfig'],
			controller: ['$scope', '$element', function ($scope, $element) {

				var ctrl = this,
				    vormControl = undefined,
				    vormFieldConfig = undefined;

				ctrl.link = function (controllers) {

					var template = undefined,
					    compiler = undefined,
					    config = undefined;

					vormControl = controllers[0];
					vormFieldConfig = controllers[1];

					config = vormFieldConfig.getConfig();

					template = config.template ? config.template.display : null;

					compiler = vormTemplateService.getDisplayCompiler(config.type, template);

					compiler($scope, function (clonedElement) {
						$element.append(clonedElement);
					});

					ctrl.getViewValue = vormControl.getViewValue;
					ctrl.getModelValue = vormControl.getModelValue;
				};
			}],
			controllerAs: 'vormDisplay',
			link: function link(scope, element, attrs, controllers) {
				controllers.shift().link(controllers);
			}
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormField', ['VormFieldCtrl', function (VormFieldCtrl) {

		return {
			scope: true,
			require: ['vormField', '^?vormForm'],
			controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

				var name = $scope.$eval($attrs.vormField) || $attrs.name || $attrs.ngModel,
				    ctrl = this;

				angular.extend(ctrl, new VormFieldCtrl(name, $element[0]));

				ctrl.link = function (controllers) {
					var _controllers2 = _slicedToArray(controllers, 1);

					var vorm = _controllers2[0];

					if (vorm) {
						vorm.addField(ctrl);
						$scope.$on('$destroy', function () {
							vorm.removeField(ctrl);
						});
					}
				};
			}],
			controllerAs: 'vormField',
			link: function link(scope, element, attrs, controllers) {
				controllers.shift().link(controllers);
			}
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').directive('vormFieldConfig', ['vormInvoke', function (vormInvoke) {

		return {
			require: ['vormFieldConfig', 'vormField', '^?vormForm'],
			controller: ['$scope', '$attrs', function ($scope, $attrs) {

				var ctrl = this,
				    config = $scope.$eval($attrs.vormFieldConfig),
				    vormField = undefined,
				    vormForm = undefined;

				function getValues() {
					var values = undefined;

					if (vormForm) {
						values = vormForm.getValues();
					} else if (vormField) {
						values = {};
						values[vormField.getName()] = vormField.getValue();
					}
					return values;
				}

				ctrl.link = function (controllers) {
					vormField = controllers[0];
					vormForm = controllers[1];

					vormField.setName(config.name);

					if (config.valueType !== undefined) {
						if (typeof config.valueType === 'string') {
							vormField.setValueType(config.valueType);
						} else if (config.valueType.type !== undefined) {
							vormField.setValueType(config.valueType.type);
						}
					}

					if (_.isArray(config.required) || typeof config.required === 'function') {
						$scope.$watch(function () {
							return ctrl.invoke(config.required);
						}, function (isRequired) {
							vormField.setRequired(!!isRequired);
						});
					} else {
						vormField.setRequired(config.required || false);
					}

					if (config.defaults) {
						vormField.setValue(ctrl.invoke(config.defaults));
					}
				};

				ctrl.invoke = function (invokable) {
					return vormInvoke(invokable, {
						$values: getValues()
					});
				};

				ctrl.invokeExpr = function (invokable) {
					return vormInvoke.expr(invokable, {
						$values: getValues()
					}, vormField.getValueScope());
				};

				ctrl.getConfig = function () {
					return config;
				};

				ctrl.invokeData = function (key) {
					return ctrl.invoke(config.data[key]);
				};

				ctrl.getLimit = function () {
					var limit = 1;

					if (vormField.getValueType() === 'list') {
						limit = -1;

						if (config.valueType && config.valueType.limit !== undefined) {
							limit = ctrl.invoke(config.valueType.limit);
						}
					}

					return limit;
				};

				ctrl.getDisplayMode = function () {
					return ctrl.invokeExpr(config.disabled) ? 'display' : 'edit';
				};
			}],
			controllerAs: 'vormFieldConfig',
			link: function link(scope, element, attrs, controllers) {
				controllers.shift().link(controllers);
			}

		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').directive('vormFieldTemplate', ['vormTemplateService', function (vormTemplateService) {

		var wrapperEl = angular.element(vormTemplateService.getDefaultTemplate());

		angular.element(wrapperEl[0].querySelectorAll('vorm-replace')).replaceWith(vormTemplateService.getDefaultControlTemplate());

		wrapperEl.attr('vorm-field-config', 'vormFieldTemplate.getConfig()');
		wrapperEl.attr('vorm-focusable-list', '');

		var template = wrapperEl[0].outerHTML;

		return {
			scope: true,
			restrict: 'E',
			template: template,
			replace: true,
			controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {

				var ctrl = this,
				    config = $scope.$eval($attrs.config) || {},
				    compiler = undefined;

				config = _.defaults(angular.copy(config), {
					name: $attrs.name,
					type: $attrs.type,
					label: $attrs.label,
					template: $scope.$eval($attrs.template),
					required: $scope.$eval($attrs.required),
					data: $scope.$eval($attrs.data) || {}
				});

				if (!config.name || !config.type) {
					throw new Error('Missing one of required arguments: name, type ');
				}

				compiler = vormTemplateService.getModelCompiler(config.type, config.modelTemplate);

				$element.attr('vorm-field', config.name);

				ctrl.getConfig = function () {
					return config;
				};

				ctrl.getModelCompiler = function () {
					return compiler;
				};
			}],
			controllerAs: 'vormFieldTemplate'
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormFieldWrapper', ['vormTemplateService', function (vormTemplateService) {

		var wrapped = angular.element(vormTemplateService.getDefaultTemplate());

		wrapped.find('vorm-replace').append('<ng-transclude></ng-transclude>');
		wrapped.attr('vorm-field-config', 'vormFieldWrapper.getConfig()');
		wrapped.attr('vorm-focusable-list', '');

		var template = wrapped[0].outerHTML;

		return {
			restrict: 'A',
			transclude: true,
			template: template,
			replace: true,
			controller: ['$attrs', function ($attrs) {

				var ctrl = this,
				    config = {
					name: $attrs.name,
					label: $attrs.label
				};

				ctrl.getConfig = function () {
					return config;
				};
			}],
			controllerAs: 'vormFieldWrapper'
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormFieldset', ['vormInvoke', function (vormInvoke) {

		return {
			restrict: 'E',
			require: ['vormFieldset', '^?vormForm'],
			template: '\n\t\t\t\t\t<fieldset>\n\t\t\t\t\t\t<vorm-field-template config="field" ng-repeat="field in vormFieldset.getFields() | filter:vormFieldset.isVisible:field">\n\t\t\t\t\t\t</vorm-field-template>\n\t\t\t\t\t</fieldset>\n\t\t\t\t',
			replace: true,
			controller: ['$scope', '$attrs', function ($scope, $attrs) {

				var ctrl = this,
				    vormForm = undefined,
				    valueScope = undefined;

				function getValues() {
					var vals = {};

					if (vormForm) {
						vals = vormForm.getValues();
					}
					return vals;
				}

				ctrl.link = function (controllers) {
					vormForm = controllers[0];
					if (vormForm) {
						valueScope = vormForm.getValueScope();
					}
				};

				ctrl.getFields = function () {
					return $scope.$eval($attrs.fields);
				};

				ctrl.isVisible = function (field) {
					return field.when === null || field.when === undefined ? true : !!vormInvoke.expr(field.when, { $values: getValues() }, valueScope);
				};
			}],
			controllerAs: 'vormFieldset',
			link: function link(scope, element, attrs, controllers) {
				controllers.shift().link(controllers);
			}
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').directive('vormFocusableList', [function () {

		return {
			controller: [function () {

				var ctrl = this,
				    ids = [];

				ctrl.addId = function (id) {
					ids.push(id);
				};

				ctrl.removeId = function (id) {
					_.pull(ids, id);
				};

				ctrl.getId = function () {
					return ids[ids.length - 1];
				};
			}]
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').directive('vormForm', ['VormValueScope', function (VormValueScope) {

		return {
			scope: true,
			require: ['form'],
			controller: ['$element', function ($element) {

				var ctrl = this,
				    fields = [],
				    changeListeners = [],
				    submitListeners = [],
				    valueScope = new VormValueScope();

				function handleChange() {
					var outerArgs = arguments;

					_.each(changeListeners, function (listener) {
						listener.apply(ctrl, outerArgs);
					});
				}

				function getFieldByName(name) {
					return _.find(fields, function (field) {
						return field.getName() === name;
					});
				}

				ctrl.addField = function (field) {
					fields.push(field);
					field.viewChangeListeners.push(handleChange);
					field.setValueScope(valueScope);
				};

				ctrl.removeField = function (field) {
					_.pull(fields, field);
					_.pull(field.viewChangeListeners, handleChange);
				};

				ctrl.getFields = function () {
					return fields;
				};

				ctrl.getValues = function () {
					var values = _(fields).indexBy(function (field) {
						return field.getName();
					}).mapValues(function (field) {
						return field.getValue();
					}).value();

					return values;
				};

				ctrl.getValue = function (name) {
					return getFieldByName(name).getValue();
				};

				ctrl.setValue = function (name, value) {
					getFieldByName(name).setValue(value);
				};

				ctrl.getValueScope = function () {
					return valueScope;
				};

				ctrl.changeListeners = changeListeners;
				ctrl.submitListeners = submitListeners;

				'valid invalid dirty pristine touched untouched'.split(' ').forEach(function (type) {
					var capitalized = type.substr(0, 1).toUpperCase() + type.substr(1),
					    getName = 'is' + capitalized,
					    setName = 'set' + capitalized,
					    method = ['valid', 'pristine', 'untouched'].indexOf(type) !== -1 ? 'every' : 'some';

					ctrl[getName] = function () {
						return fields[method](function (field) {
							return field[getName]();
						});
					};

					if (!(type === 'valid' || type === 'invalid')) {
						ctrl[setName] = function () {
							var outerArgs = arguments;

							fields.forEach(function (field) {
								field[setName].apply(field, outerArgs);
							});
						};
					}
				});

				$element.bind('submit', function () {
					_.invoke(submitListeners, 'call', null, ctrl.getValues());
				});

				return ctrl;
			}],
			controllerAs: 'vormForm'
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').factory('vormInvoke', ['$injector', '$parse', function ($injector, $parse) {

		function invoke(invokable, locals) {
			var value = undefined;

			if (!invokable) {
				return invokable;
			}

			if (_.isArray(invokable) && typeof _.last(invokable) === 'function' || invokable.$inject !== undefined) {
				value = $injector.invoke(invokable, null, locals ? angular.copy(locals) : null);
			} else if (typeof invokable === 'function') {
				value = invokable();
			} else {
				value = invokable;
			}

			return value;
		}

		var invoker = function invoker(invokable, locals) {
			return invoke(invokable, locals);
		};

		invoker.expr = function (invokable, locals, scope) {
			var value = undefined;
			if (typeof invokable === 'string') {
				value = $parse(invokable)(scope, locals);
			} else {
				value = invoke(invokable, locals);
			}
			return value;
		};

		return invoker;
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormLabel', [function () {

		return {
			require: ['vormLabel', '^vormFieldConfig', '^vormFocusableList'],
			template: '<label class="vorm-field-label">{{vormLabel.getLabel()}}</label>',
			replace: true,
			controller: ['$scope', '$element', function ($scope, $element) {

				var ctrl = this,
				    vormFieldConfig = undefined,
				    vormFocusableList = undefined;

				ctrl.link = function (controllers) {
					vormFieldConfig = controllers[0];
					vormFocusableList = controllers[1];

					$scope.$watch(vormFocusableList.getId, function (inputId) {
						$element.attr('for', inputId);
					});
				};

				ctrl.getLabel = function () {
					return vormFieldConfig.invoke(vormFieldConfig.getConfig().label);
				};
			}],
			controllerAs: 'vormLabel',
			link: function link(scope, element, attrs, controllers) {

				controllers[0].link(controllers.slice(1));
			}
		};
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').directive('vormSubmit', ['$parse', function ($parse) {

		return {
			require: ['vormForm'],
			link: function link(scope, element, attrs, controllers) {
				var _controllers3 = _slicedToArray(controllers, 1);

				var vorm = _controllers3[0];

				var cb = undefined;

				function handleSubmit() {
					cb(scope, {
						$values: vorm.getValues()
					});
				}

				cb = $parse(attrs.vormSubmit);

				element.bind('submit', handleSubmit);
			}
		};
	}]);
})();

/*global angular,_*/
(function () {

	angular.module('vorm').provider('vormTemplateService', [function () {

		var wrapperTemplate = undefined,
		    controlTemplate = undefined,
		    compilers = { model: {}, display: {} },
		    templates = { model: {}, display: { 'null': angular.element('<span>{{vormDisplay.getViewValue()}}</span>') } };

		var vormTemplateService = {};

		wrapperTemplate = '<div ng-class="vormField.getClassObj()">' + '<vorm-label></vorm-label>' + '<vorm-replace></vorm-replace>' + '</div>';

		controlTemplate = '<vorm-control-list>' + '<vorm-control ng-repeat="delegate in vormControlList.getDelegates()" delegate="delegate">' + '<vorm-edit ng-show="vormControl.getDisplayMode()===\'edit\'">' + '<vorm-control-replace></vorm-control-replace>' + '<button class="vorm-control-clear-button" type="button" ng-click="vormControlList.handleClearClick(delegate)" ng-show="vormControlList.isClearButtonVisible()">x</button>' + '</vorm-edit>' + '<vorm-display ng-show="vormControl.getDisplayMode()===\'display\'"></vorm-display>' + '</vorm-control>' + '<vorm-delegate-button>' + '</vorm-delegate-button>' + '</vorm-control-list>';

		function modifyModelTemplates(processor) {
			templates.model = _.mapValues(templates.model, function (template, type) {
				return processor(template, type);
			});
		}

		function modifyDisplayTemplates(processor) {
			templates.display = _.mapValues(templates.display, function (template, type) {
				return processor(template, type);
			});
		}

		function modifyTemplate(processor) {
			var processedEl = processor(angular.element(wrapperTemplate));
			processedEl.attr('vorm-field', '');

			processedEl.find('vorm-control').attr('limit', 'vormFieldConfig.getLimit()');

			wrapperTemplate = processedEl[0].outerHTML;
		}

		function modifyControlTemplate(processor) {
			var wrapper = angular.element('<p></p>');
			wrapper.append(processor(angular.element(controlTemplate)));
			controlTemplate = wrapper[0].innerHTML;
		}

		function registerType(type, modelTemplate, displayTemplate) {
			templates.model[type] = modelTemplate;
			if (displayTemplate) {
				templates.display[type] = displayTemplate;
			}
		}

		modifyTemplate(function () {
			return angular.element(wrapperTemplate);
		});

		modifyControlTemplate(function () {
			return angular.element(controlTemplate);
		});

		return {
			$get: ['$compile', function ($compile) {

				function getCompiler(type, controlType, template) {
					var compiler = undefined,
					    pool = compilers[type];

					if (template) {
						compiler = $compile(template);
					} else {
						compiler = pool[controlType];
					}

					if (!compiler && type === 'display') {
						compiler = getCompiler(type, null);
					}

					if (!compiler) {
						throw new Error('' + _.capitalize(type) + ' template for ' + controlType + ' not found');
					}

					return compiler;
				}

				vormTemplateService.getDefaultTemplate = function () {
					return wrapperTemplate;
				};

				vormTemplateService.getDefaultControlTemplate = function () {
					return controlTemplate;
				};

				vormTemplateService.getModelCompiler = function (type, template) {
					return getCompiler('model', type, template);
				};

				vormTemplateService.getDisplayCompiler = function (type, template) {
					return getCompiler('display', type, template);
				};

				compilers.model = _.mapValues(templates.model, function (el) {
					var modelEl = undefined;

					_.some(el, function (element) {

						var childEl = undefined;

						if (element.hasAttribute('ng-model')) {
							modelEl = angular.element(element);
						} else if (childEl = element.querySelector('[ng-model]')) {
							modelEl = angular.element(childEl);
						}

						return !!modelEl;
					});

					if (!modelEl) {
						modelEl = el;
					}

					modelEl.attr('ng-model', 'delegate.value');
					modelEl.attr('name', '{{delegate.getName()}}');
					modelEl.attr('ng-required', 'vormControl.isRequired()');

					return $compile(el);
				});

				compilers.display = _.mapValues(templates.display, function (el) {
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
})();

/*global angular,_*/
(function () {

	angular.module('vorm').config(['vormTemplateServiceProvider', function (vormTemplateServiceProvider) {

		var templates = _('date datetime datetime-local email month number password search tel text time url week checkbox'.split(' ')).zipObject().mapValues(function (value, key) {
			var placeholder = _.includes('text search tel url email number password'.split(' '), key) ? 'placeholder="{{vormControl.invokeData(\'placeholder\')}}"' : '',
			    tpl = '<input type="' + key + '" ' + placeholder + ' ng-model/>';

			if (key === 'checkbox') {
				tpl = '<label for="{{vormControl.getInputId()}}">' + tpl + '{{vormControl.invokeData("checkboxLabel")}}' + '</label>';
			}
			return tpl;
		}).value();

		for (var type in templates) {
			vormTemplateServiceProvider.registerType(type, angular.element(templates[type]));
		}
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').config(['vormTemplateServiceProvider', function (vormTemplateServiceProvider) {

		var el = angular.element('<div class="vorm-radio-group">' + '<label ng-repeat="option in vormControl.getOptions()">' + '<input type="radio" ng-model name="{{::vormField.getName()}}" value="{{::option.value}}"/>' + '{{::option.label}}' + '</label>' + '</div>');

		vormTemplateServiceProvider.registerType('radio', el);
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').config(['vormTemplateServiceProvider', function (vormTemplateServiceProvider) {

		var el = angular.element('<select ng-options="option.value as option.label for option in vormControl.getOptions()"><option value="" ng-show="!!vormControl.invokeData(\'notSelectedLabel\')">{{vormControl.invokeData(\'notSelectedLabel\')}}</option></select>');

		vormTemplateServiceProvider.registerType('select', el);
	}]);
})();

/*global angular*/
(function () {

	angular.module('vorm').config(['vormTemplateServiceProvider', function (vormTemplateServiceProvider) {

		var el = angular.element('<textarea placeholder="{{vormControl.invokeData(\'placeholder\')}}"></textarea>');

		vormTemplateServiceProvider.registerType('textarea', el);
	}]);
})();
//# sourceMappingURL=vorm.js.map