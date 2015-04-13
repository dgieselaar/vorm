"use strict";!function(){angular.module("vorm",[])}();!function(){angular.module("vorm").factory("VormEvent",["$document","$window",function(t,n){var e=void 0;try{{new n.CustomEvent("foo")}e=function(t,e){return new n.CustomEvent(t,{detail:e,bubbles:!0})}}catch(o){e=function(n,e){var o=t[0].createEvent("CustomEvent");return o.initCustomEvent(n,!0,!0,e),o}}return e}])}();!function(){angular.module("vorm").factory("VormFieldCtrl",["$rootScope","VormEvent","VormValueType","VormValueScope",function(e,n,t,i){return function(e,r){function u(){var e=void 0;switch(m){case t.SINGLE:e=null;break;case t.LIST:e=[];break;case t.NAMED:e={}}return e}function a(e,n){var t=e.$viewChangeListeners,i=e.$modelValue;e.$viewChangeListeners=[],e.$modelValue=n,e.$$writeModelToScope(),e.listeners=t,e.$modelValue=i}function o(){var n=V[e];switch(m){case t.SINGLE:f[0]&&a(f[0],n);break;case t.LIST:_.each(f,function(e,t){a(e,n[t])});break;case t.NAMED:var i=f.concat();_.each(n,function(e,n){var t=_.find(f,{$name:n});t&&a(t,e),_.pull(i,t)}),_.each(i,function(e){a(e,void 0)})}}function c(){var e=void 0;switch(m){case t.SINGLE:e=f[0]?f[0].$modelValue:void 0;break;case t.LIST:e=_.pluck(f,"$modelValue");break;case t.NAMED:e={},_.each(f,function(n){e[n.$name]=n.$modelValue})}return e}function l(){V[e]=c(),d.triggerViewChange()}function s(n){return V[e]=c(),d.triggerModelChange(),n}var d={},f=[],v=[],p=[],h="vorm-field-",m=t.SINGLE,g=void 0,V=new i;d.triggerModelChange=function(){r.dispatchEvent(new n("modelchange",{name:e})),_.invoke(p,"call",null,e)},d.triggerViewChange=function(){r.dispatchEvent(new n("viewchange",{name:e})),_.invoke(v,"call",null,e)},d.getName=function(){return e},d.setName=function(){e=arguments[0]},d.addModel=function(n){f.push(n),n.$viewChangeListeners.push(l),n.$formatters.push(s),V[e]=c()},d.removeModel=function(n){_.pull(f,n),_.pull(n.$viewChangeListeners,l),_.pull(n.$formatters,s),V[e]=c()},d.getModels=function(){return f},d.getValue=function(){return V[e]},d.getValueType=function(){return m},d.setValueType=function(n){if(-1===[t.SINGLE,t.LIST,t.NAMED].indexOf(n))throw new Error("Unsupported VormValueType: "+t);m=n,V[e]=u()},d.setValue=function(n){V[e]=n,o()},d.isRequired=function(){return g},d.setRequired=function(e){g=!!e},d.isEmpty=function(){return f.every(function(e){return e.$isEmpty()})},d.setValueScope=function(n){var t=V[e];V&&V.$destroy(),V=n,V[e]=t};var $=_("valid invalid dirty pristine touched untouched required empty".split(" ")).map(function(e){return h+e}).zipObject().mapValues(function(e,n){var t=n.substr(h.length);return d["is"+_.capitalize(t)]()});return d.getClassObj=function(){return $.value()},d.viewChangeListeners=v,d.modelChangeListeners=p,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=_.capitalize(e),t="is"+n,i="$"+e,r="set"+n,u=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";d[t]=function(){return f[u](function(e){return e[i]})},"valid"!==e&&"invalid"!==e&&(d[r]=function(){var e=arguments;f.forEach(function(n){n["$"+r].apply(n,e)})})}),V[e]=u(),d}}])}();!function(){angular.module("vorm").factory("VormModelDelegate",[function(){return function(e){var n={},u=void 0;return n.value=null,n.getName=function(){return e},n.setNgModel=function(){u=arguments[0]},n.getNgModel=function(){return u},n.clearViewValue=function(){u.$setViewValue(null),u.$render()},n}}])}();!function(){angular.module("vorm").factory("VormValueScope",["$rootScope",function(o){return function(){var n=o.$new();return n}}])}();!function(){angular.module("vorm").constant("VormValueType",{SINGLE:"single",LIST:"list",NAMED:"named"})}();var _slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){var n=[],o=!0,t=!1,i=void 0;try{for(var l,a=r[Symbol.iterator]();!(o=(l=a.next()).done)&&(n.push(l.value),!e||n.length!==e);o=!0);}catch(d){t=!0,i=d}finally{try{!o&&a["return"]&&a["return"]()}finally{if(t)throw i}}return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("ngModel",["VormFieldCtrl",function(r){return{require:["ngModel","^?vormField","^?vormForm"],link:function(e,n,o,t){var i=_slicedToArray(t,3),l=i[0],a=i[1],d=i[2];(a||d)&&(a||(a=new r(o.name||o.ngModel,n[0]),d&&(d.addField(a),e.$on("$destroy",function(){d.removeField(a)}))),a.addModel(l),e.$on("$destroy",function(){a.removeModel(l)}))}}}])}();!function(){angular.module("vorm").directive("vormChange",["$parse",function(n){return{link:function(e,a,i){function r(n,a){t(e,{$event:n,$name:n.detail?n.detail.name:a})}var t=n(i.vormChange);a.bind("viewchange",r)}}}])}();!function(){angular.module("vorm").directive("vormControl",["$document",function(e){var t=function(){var t=e[0].createElement("div");return _(["","ms","moz","webkit"]).map(function(e){return e?e+"MatchesSelector":"matches"}).find(function(e){return e in t})}();return{restrict:"E",require:["vormControl","^vormField","^vormFieldConfig","^vormFocusableList","^vormFieldTemplate"],controller:["$scope","$element","$attrs",function(e,n,o){var r,i,a,l,u=this,c=Math.random().toString(36).slice(2);u.link=function(s){r=s[0],i=s[1],a=s[2],l=s[3],u.invokeData=i.invokeData,u.getData=i.getData,u.getConfig=i.getConfig,a.addId(c),l.getModelCompiler()(e,function(r){var i=void 0,a="input,keygen,meter,output,progress,select,textarea",l=n.find("vorm-control-replace");l.replaceWith(r),r[0].className+=" "+l[0].className,i=r[0][t](a)?r:angular.element(r[0].querySelector(a)),i.attr("id",u.getInputId()),e.$$postDigest(function(){e.$eval(o.delegate).setNgModel(r.controller("ngModel"))})})},u.isRequired=function(){return r&&r.isRequired()},u.getInputId=function(){return c},u.getOptions=angular.version.minor>=4?function(){return u.invokeData("options")}:function(){var e=void 0;return function(){var t=u.invokeData("options");return e===t||angular.equals(e,t)||(e=t),e}}(),e.$on("$destroy",function(){a.removeId(c)})}],controllerAs:"vormControl",link:function(e,t,n,o){o[0].link(o.slice(1))}}}])}();!function(){angular.module("vorm").directive("vormControlList",["VormModelDelegate","$document",function(e,t){return{require:["vormControlList","^vormFieldConfig","^?vormFocusableList","^vormField"],restrict:"E",controller:["$scope",function(n){function i(e){var t=n.$watchCollection(g.getModels,function(){g.triggerViewChange(),e(),t()})}function o(){if(a){var e=a.getId(),n=t[0].getElementById(e);n&&n.focus()}}var r=this,l=[],c=0/0,u=void 0,a=void 0,g=void 0;r.link=function(e){u=e[0],a=e[1],g=e[2],n.$watch(u.getLimit,function(e){r.setLimit(e)}),r.createDelegate()},r.getDelegates=function(){return l},r.createDelegate=function(t){var n=void 0;t||(t=l.length.toString()),n=new e(t),l.push(n)},r.removeDelegate=function(e){_.pull(l,e)},r.clearDelegate=function(e){e.clearViewValue()},r.getLimit=function(){return c},r.setLimit=function(e){c=Number(e)},r.reachedLimit=function(){return c>0&&l.length>=c},r.isClearButtonVisible=function(){return"list"===g.getValueType()},r.handleCreateClick=function(){r.createDelegate(),i(o)},r.handleClearClick=function(e){1===l.length?e.clearViewValue():(r.removeDelegate(e),i(o))}}],controllerAs:"vormControlList",link:function(e,t,n,i){i.shift().link(i)}}}])}();!function(){angular.module("vorm").directive("vormDelegateButton",[function(){return{require:["vormDelegateButton","^vormFieldConfig","^vormControlList","^vormField"],template:'<button class="vorm-delegate-button" type="button" ng-click="vormDelegateButton.handleClick()" ng-disabled="vormDelegateButton.isDisabled()" ng-show="vormDelegateButton.isVisible()">{{vormDelegateButton.getLabel()}}</button>',replace:!0,controller:[function(){var e=this,t=void 0,n=void 0,o=void 0;e.link=function(e){t=e[0],n=e[1],o=e[2]},e.handleClick=function(){n.handleCreateClick()},e.isDisabled=function(){return n.reachedLimit()},e.isVisible=function(){return"list"===o.getValueType()},e.getLabel=function(){var e=t.getConfig(),n=e?e.valueType:null,o=n&&n.addLabel?t.invoke(n.addLabel):"";return o}}],link:function(e,t,n,o){o.shift().link(o)},controllerAs:"vormDelegateButton"}}])}();var _slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){var n=[],t=!0,o=!1,i=void 0;try{for(var l,a=r[Symbol.iterator]();!(t=(l=a.next()).done)&&(n.push(l.value),!e||n.length!==e);t=!0);}catch(d){o=!0,i=d}finally{try{!t&&a["return"]&&a["return"]()}finally{if(o)throw i}}return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("vormField",["VormFieldCtrl",function(r){return{scope:!0,require:["vormField","^?vormForm"],controller:["$scope","$element","$attrs",function(e,n,t){var o=e.$eval(t.vormField)||t.name||t.ngModel,i=this;angular.extend(i,new r(o,n[0])),i.link=function(r){var n=_slicedToArray(r,1),t=n[0];t&&(t.addField(i),e.$on("$destroy",function(){t.removeField(i)}))}}],controllerAs:"vormField",link:function(r,e,n,t){t.shift().link(t)}}}])}();!function(){angular.module("vorm").directive("vormFieldConfig",["vormInvoke",function(e){return{require:["vormFieldConfig","vormField","^?vormForm"],controller:["$scope","$attrs",function(i,n){var t=this,o=i.$eval(n.vormFieldConfig),r=void 0,u=void 0;t.link=function(e){r=e[0],u=e[1],r.setName(o.name),void 0!==o.valueType&&("string"==typeof o.valueType?r.setValueType(o.valueType):void 0!==o.valueType.type&&r.setValueType(o.valueType.type)),_.isArray(o.required)||"function"==typeof o.required?i.$watch(function(){return t.invoke(o.required)},function(e){r.setRequired(!!e)}):r.setRequired(o.required||!1)},t.invoke=function(i){var n=void 0;return u?n=u.getValues():r&&(n={},n[r.getName()]=r.getValue()),e(i,{$values:n})},t.getConfig=function(){return o},t.invokeData=function(e){return t.invoke(o.data[e])},t.getLimit=function(){var e=1;return"list"===r.getValueType()&&(e=-1,o.valueType&&void 0!==o.valueType.limit&&(e=t.invoke(o.valueType.limit))),e}}],controllerAs:"vormFieldConfig",link:function(e,i,n,t){t.shift().link(t)}}}])}();!function(){angular.module("vorm").directive("vormFieldTemplate",["vormTemplateService",function(e){var t=angular.element(e.getDefaultTemplate());angular.element(t[0].querySelectorAll("vorm-replace")).replaceWith(e.getDefaultControlTemplate()),t.attr("vorm-field-config","vormFieldTemplate.getConfig()"),t.attr("vorm-focusable-list","");var r=t[0].outerHTML;return{scope:!0,restrict:"E",template:r,replace:!0,controller:["$scope","$attrs",function(t,r){var l=this,a=t.$eval(r.config)||{},o=void 0;if(a=_.defaults(angular.copy(a),{name:r.name,type:r.type,label:r.label,template:t.$eval(r.template),required:t.$eval(r.required),data:t.$eval(r.data)||{}}),!a.name||!a.type)throw new Error("Missing one of required arguments: name, type ");o=e.getModelCompiler(a.type,a.modelTemplate),l.getConfig=function(){return a},l.getModelCompiler=function(){return o}}],controllerAs:"vormFieldTemplate"}}])}();!function(){angular.module("vorm").directive("vormFieldWrapper",["vormTemplateService",function(e){var r=angular.element(e.getDefaultTemplate());r.find("vorm-replace").append("<ng-transclude></ng-transclude>"),r.attr("vorm-field-config","vormFieldWrapper.getConfig()"),r.attr("vorm-focusable-list","");var t=r[0].outerHTML;return{restrict:"A",transclude:!0,template:t,replace:!0,controller:["$attrs",function(e){var r=this,t={name:e.name,label:e.label};r.getConfig=function(){return t}}],controllerAs:"vormFieldWrapper"}}])}();!function(){angular.module("vorm").directive("vormFieldset",["vormInvoke",function(e){return{restrict:"E",require:["vormFieldset","^?vormForm"],template:'\n					<fieldset>\n						<vorm-field-template config="field" ng-repeat="field in vormFieldset.getFields() | filter:vormFieldset.isVisible:field">\n						</vorm-field-template>\n					</fieldset>\n				',replace:!0,controller:["$scope","$attrs",function(i,t){function n(){var e={};return r&&(e=r.getValues()),e}var l=this,r=void 0,o=void 0;l.link=function(e){r=e[0],r&&(o=r.getValueScope())},l.getFields=function(){return i.$eval(t.fields)},l.isVisible=function(i){return null===i.when||void 0===i.when?!0:!!e.expr(i.when,o,{$values:n()})}}],controllerAs:"vormFieldset",link:function(e,i,t,n){n.shift().link(n)}}}])}();!function(){angular.module("vorm").directive("vormFocusableList",[function(){return{controller:[function(){var n=this,t=[];n.addId=function(n){t.push(n)},n.removeId=function(n){_.pull(t,n)},n.getId=function(){return t[t.length-1]}}]}}])}();!function(){angular.module("vorm").directive("vormForm",["VormValueScope",function(e){return{scope:!0,require:["form"],controller:["$element",function(n){function t(){var e=arguments;_.each(i,function(n){n.apply(r,e)})}var r=this,u=[],i=[],o=[],a=new e;return r.addField=function(e){u.push(e),e.viewChangeListeners.push(t),e.setValueScope(a)},r.removeField=function(e){_.pull(u,e),_.pull(e.viewChangeListeners,t)},r.getFields=function(){return u},r.getValues=function(){var e=_(u).indexBy(function(e){return e.getName()}).mapValues(function(e){return e.getValue()}).value();return e},r.getValueScope=function(){return a},r.changeListeners=i,r.submitListeners=o,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=e.substr(0,1).toUpperCase()+e.substr(1),t="is"+n,i="set"+n,o=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";r[t]=function(){return u[o](function(e){return e[t]()})},"valid"!==e&&"invalid"!==e&&(r[i]=function(){var e=arguments;u.forEach(function(n){n[i].apply(n,e)})})}),n.bind("submit",function(){_.invoke(o,"call",null,r.getValues())}),r}],controllerAs:"vormForm"}}])}();!function(){angular.module("vorm").factory("vormInvoke",["$injector","$parse",function(n,r){function o(r,o){var t=void 0;return r?t=_.isArray(r)&&"function"==typeof _.last(r)||void 0!==r.$inject?n.invoke(r,null,angular.copy(o)):"function"==typeof r?r():r:r}var t=function(n,r){return o(n,r)};return t.expr=function(n,t,i){var u=void 0;return u="string"==typeof n?r(n)(i,t):o(n,t)},t}])}();!function(){angular.module("vorm").directive("vormLabel",[function(){return{require:["vormLabel","^vormFieldConfig","^vormFocusableList"],template:'<label class="vorm-field-label">{{vormLabel.getLabel()}}</label>',replace:!0,controller:["$scope","$element",function(e,l){var o=this,n=void 0,r=void 0;o.link=function(o){n=o[0],r=o[1],e.$watch(r.getId,function(e){l.attr("for",e)})},o.getLabel=function(){return n.invoke(n.getConfig().label)}}],controllerAs:"vormLabel",link:function(e,l,o,n){n[0].link(n.slice(1))}}}])}();var _slicedToArray=function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){var e=[],n=!0,i=!1,o=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(e.push(a.value),!t||e.length!==t);n=!0);}catch(l){i=!0,o=l}finally{try{!n&&u["return"]&&u["return"]()}finally{if(i)throw o}}return e}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("vormSubmit",["$parse",function(r){return{require:["vormForm"],link:function(t,e,n,i){function o(){l(t,{$values:u.getValues()})}var a=_slicedToArray(i,1),u=a[0],l=void 0;l=r(n.vormSubmit),e.bind("submit",o)}}}])}();!function(){angular.module("vorm").provider("vormTemplateService",[function(){function e(e){i=_.mapValues(i,function(t,r){return e(t,r)})}function t(e){var t=e(angular.element(n));t.attr("vorm-field",""),t.find("vorm-control").attr("limit","vormFieldConfig.getLimit()"),n=t[0].outerHTML}function r(e){var t=angular.element("<p></p>");t.append(e(angular.element(l))),l=t[0].innerHTML}function o(e,t){i[e]=t}var n=void 0,l=void 0,a=void 0,i={},u={};return n='<div ng-class="vormField.getClassObj()"><vorm-label></vorm-label><vorm-replace></vorm-replace></div>',l='<vorm-control-list><vorm-control ng-repeat="delegate in vormControlList.getDelegates()" delegate="delegate"><vorm-control-replace></vorm-control-replace><button class="vorm-control-clear-button" type="button" ng-click="vormControlList.handleClearClick(delegate)" ng-show="vormControlList.isClearButtonVisible()">x</button></vorm-control><vorm-delegate-button></vorm-delegate-button></vorm-control-list>',i=_.mapValues(i,function(e){return angular.element(e)}),t(function(){return angular.element(n)}),r(function(){return angular.element(l)}),{$get:["$compile",function(e){return u.getDefaultTemplate=function(){return n},u.getDefaultControlTemplate=function(){return l},u.getModelCompiler=function(t,r){var o=void 0;if(o=r?e(r):a[t],!o)throw new Error("Model template for "+t+" not found");return o},a=_.mapValues(i,function(t){var r=void 0;return _.some(t,function(e){var t=void 0;return e.hasAttribute("ng-model")?r=angular.element(e):(t=e.querySelector("[ng-model]"))&&(r=angular.element(t)),!!r}),r||(r=t),r.attr("ng-model","delegate.value"),r.attr("ng-required","vormControl.isRequired()"),e(t)}),u}],modifyModelTemplates:e,modifyControlTemplate:r,modifyTemplate:t,registerType:o}}])}();!function(){angular.module("vorm").config(["vormTemplateServiceProvider",function(e){var r=_("date datetime datetime-local email month number password search tel text time url week checkbox".split(" ")).zipObject().mapValues(function(e,r){var t=_.includes("text search tel url email number password".split(" "),r)?"placeholder=\"{{vormControl.invokeData('placeholder')}}\"":"";return'<input type="'+r+'" '+t+"/>"}).value();for(var t in r)e.registerType(t,angular.element(r[t]))}])}();!function(){angular.module("vorm").config(["vormTemplateServiceProvider",function(o){var e=angular.element('<select ng-options="option.value as option.label for option in vormControl.getOptions()"><option value="" ng-show="!!vormControl.invokeData(\'notSelectedLabel\')">{{vormControl.invokeData(\'notSelectedLabel\')}}</option></select>');o.registerType("select",e)}])}();!function(){angular.module("vorm").config(["vormTemplateServiceProvider",function(e){var r=angular.element("<textarea placeholder=\"{{vormControl.invokeData('placeholder')}}\"></textarea>");e.registerType("textarea",r)}])}();!function(){angular.module("vorm").config(["vormTemplateServiceProvider",function(o){var e=angular.element('<vorm-radio-group><label ng-repeat="option in vormControl.getOptions()"><input type="radio" ng-model name="{{::vormField.getName()}}" value="{{::option.value}}"/>{{::option.label}}</label></vorm-radio-group>');o.registerType("radio",e)}])}();!function(){angular.module("vorm").config(["vormTemplateServiceProvider",function(e){var o=angular.element('<div class="vorm-radio-group"><label ng-repeat="option in vormControl.getOptions()"><input type="radio" ng-model name="{{::vormField.getName()}}" value="{{::option.value}}"/>{{::option.label}}</label></div>');e.registerType("radio",o)}])}();
//# sourceMappingURL=vorm.js.map