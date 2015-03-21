"use strict";!function(){angular.module("vorm",[])}();!function(){angular.module("vorm").factory("ModelDelegate",[function(){return function(n){var e={};return e.value=void 0,e.getName=function(){return n},e}}])}();!function(){angular.module("vorm").factory("VormEvent",["$document","$window",function(n,t){var e;try{{new t.CustomEvent("vormchange")}e=function(n,e){return new t.CustomEvent(n,{detail:e})}}catch(o){e=function(t,e){var o=n[0].createEvent("CustomEvent");return o.initCustomEvent(t,!0,!0,e),o}}return e}])}();!function(){angular.module("vorm").factory("VormFieldCtrl",["VormEvent","VormValueType",function(e,n){return function(t,a){function u(e,n){var t=e.$viewChangeListeners,a=e.$modelValue;e.$viewChangeListeners=[],e.$modelValue=n,e.$$writeModelToScope(),e.listeners=t,e.$modelValue=a}function r(){a.dispatchEvent(new e("vormchange",{name:t}))}var i={},o=[],c=[],l=n.SINGLE;return i.getName=function(){return t},i.setName=function(){t=arguments[0]},i.addModel=function(e){o.push(e),e.$viewChangeListeners.push(r)},i.removeModel=function(e){_.pull(o,e),_.pull(e.$viewChangeListeners,r)},i.getModels=function(){return o},i.getValue=function(){var e;switch(l){case n.SINGLE:e=o[0]?o[0].$modelValue:void 0;break;case n.LIST:e=_.pluck(o,"$modelValue");break;case n.NAMED:e={},_.each(o,function(n){e[n.$name]=n.$modelValue})}return e},i.getValueType=function(){return l},i.setValueType=function(e){if(-1===[n.SINGLE,n.LIST,n.NAMED].indexOf(e))throw new Error("Unsupported VormValueType: "+n);l=e},i.setValue=function(e){switch(l){case n.SINGLE:o[0]&&u(o[0],e);break;case n.LIST:_.each(o,function(n,t){u(n,e[t])});break;case n.NAMED:var t=o.concat();_.each(e,function(e,n){var a=_.find(o,{$name:n});a&&u(a,e),_.pull(t,a)}),_.each(t,function(e){u(e,void 0)})}},i.changeListeners=c,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=e.substr(0,1).toUpperCase()+e.substr(1),t="is"+n,a="$"+e,u="set"+n,r=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";i[t]=function(){return o[r](function(e){return e[a]})},"valid"!==r&&"invalid"!==r&&(i[u]=function(){var e=arguments;o.forEach(function(n){n["$"+u].apply(n,e)})})}),i}}])}();!function(){angular.module("vorm").constant("VormValueType",{SINGLE:"single",LIST:"list",NAMED:"named"})}();var _slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){for(var o,n=[],t=r[Symbol.iterator]();!(o=t.next()).done&&(n.push(o.value),!e||n.length!==e););return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("ngModel",["VormFieldCtrl",function(r){return{require:["ngModel","^?vormField","^?vormForm"],link:function(e,o,n,t){var i=_slicedToArray(t,3),d=i[0],l=i[1],a=i[2];(l||a)&&(l||(l=new r(n.ngModel,o[0]),a.addField(l),e.$on("$destroy",function(){a.removeField(l)})),l.addModel(d),e.$on("$destroy",function(){l.removeModel(d)}))}}}])}();!function(){angular.module("vorm").directive("vormChange",["$parse",function(n){return{link:function(e,r,o){function a(n,r){i(e,{$event:n,$name:r})}var i;i=n(o.vormChange),r.bind("vormchange",a)}}}])}();var _slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){for(var o,n=[],t=r[Symbol.iterator]();!(o=t.next()).done&&(n.push(o.value),!e||n.length!==e););return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("vormField",["VormFieldCtrl",function(r){return{scope:!0,require:["vormField","^?vormForm"],controller:["$scope","$element","$attrs",function(e,o,n){var t=e.$eval(n.vormField)||n.ngModel;angular.extend(this,new r(t,o[0]))}],controllerAs:"vormField",link:function(r,e,o,n){var t=_slicedToArray(n,2),i=t[0],l=t[1];l&&(l.addField(i),r.$on("$destroy",function(){l.removeField(i)}))}}}])}();!function(){angular.module("vorm").directive("vormFieldTemplate",["vormTemplateService","VormValueType",function(e,t){return{restrict:"E",require:["vormFieldTemplate","vormField","vormModelList"],template:e.getDefaultTemplate(),replace:!0,controller:["$scope","$attrs",function(l,r){var a,n,o,i=this,m=l.$eval(r.config)||{};if(m=_.defaults(angular.copy(m),{name:r.name,type:r.type,label:r.label,template:l.$eval(r.label)}),!m.name||!m.type)throw new Error("Missing one of required arguments: name, type ");a=e.getModelCompiler(m.type,m.modelTemplate),i.link=function(e){n=e[0],o=e[1],n.setName(m.name),m.limit>1&&n.setValueType(t.LIST),o.addModelDelegate()},i.getLabel=function(){return m.label},i.getModelCompiler=function(){return a},i.getInputData=function(){return m.data}}],controllerAs:"vormFieldTemplate",link:function(e,t,l,r){r[0].link(r.slice(1))}}}])}();!function(){angular.module("vorm").directive("vormForm",["$window",function(){return{scope:!0,require:["form"],controller:["$element",function(n){function e(){var n=arguments;_.each(u,function(e){e.apply(t,n)})}var t=this,r=[],u=[],i=[];return t.addField=function(n){r.push(n),n.changeListeners.push(e)},t.removeField=function(n){_.pull(r,n),_.pull(n.changeListeners,e)},t.getFields=function(){return r},t.getValues=function(){var n;return n=_(r).indexBy(function(n){return n.getName()}).mapValues(function(n){return n.getValue()}).value()},t.changeListeners=u,t.submitListeners=i,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(n){var e=n.substr(0,1).toUpperCase()+n.substr(1),u="is"+e,i="set"+e,o="every";t[u]=function(){return r[o](function(n){return n[u]()})},"valid"!==o&&"invalid"!==o&&(t[i]=function(){var n=arguments;r.forEach(function(e){e[i].apply(e,n)})})}),n.bind("submit",function(){_.each(i,function(n){n()})}),t}],controllerAs:"vormForm"}}])}();var _slicedToArray=function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e)){for(var t,n=[],o=e[Symbol.iterator]();!(t=o.next()).done&&(n.push(t.value),!r||n.length!==r););return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("vormInput",[function(){return{require:["^?vormFieldTemplate"],scope:{modelDelegate:"&",config:"&",type:"&"},controllerAs:"vormInput",link:function(e,r,t,n,o){var i=_slicedToArray(n,1),l=i[0];if(l)r.replaceWith(l.getModelCompiler()(e));else{if(!o)throw new Error("vormInput needs either a transclude function or vormFieldGenerator.");o(function(e){r.replaceWith(e)})}}}}])}();!function(){angular.module("vorm").directive("vormModelList",["ModelDelegate",function(e){return{controller:[function(){var t=this,l=[];t.getModelDelegates=function(){return l},t.clearModelDelegate=function(e){1===l.length?e.value=void 0:_.pull(l,e)},t.addModelDelegate=function(t){var o;t||(t=l.length.toString()),o=new e(t),l.push(l)}}],controllerAs:"vormModelList"}}])}();var _slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){for(var t,n=[],i=r[Symbol.iterator]();!(t=i.next()).done&&(n.push(t.value),!e||n.length!==e););return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm").directive("vormSubmit",["$parse",function(r){return{require:["vormForm"],link:function(e,t,n,i){function o(){u(e,{$values:l.getValues()})}var u,a=_slicedToArray(i,1),l=a[0];u=r(n.vormSubmit),t.bind("submit",o)}}}])}();!function(){angular.module("vorm").provider("vormTemplateService",[function(){var e,t={},l={},n={};return e='\n				<div class="vorm-field"\n					ng-class="vormField.getClassObj()"\n					vorm-field\n					vorm-model-list\n					>\n					<div class="vorm-field-label">\n						{{vormFieldTemplate.getLabel()}}\n					</div>\n					\n					<ul class="vorm-input-list">\n						<li class="vorm-input" ng-repeat="model in vormModelList.getModelDelegates()">\n							<vorm-input data-type="vormFieldTemplate.getInputType()" data-config="vormFieldTemplate.getInputData()" model-delegate="model"></vorm-input>\n							<button class="vorm-input-clear" type="button" ng-click="vormModelList.clearModelDelegate(model)">\n							</button>\n						</li>\n					</ul>\n					\n					<div class="vorm-field-status">\n						\n					</div>\n				</div>\n			',l.text='<input type="text" placeholder="{{vormFieldTemplate.getPlaceholder()}}"/>',{$get:function(o){return t.getDefaultTemplate=function(){return e},t.getModelCompiler=function(e,t){var l;if(l=t?o(t):n[e],!l)throw new Error("Model template for "+e+" not found");return l},n=_.mapValues(l,function(e){var t=angular.element(e);return t.attr("ng-model","model.value"),o(t)}),t},$inject:["$compile"]}}])}();
//# sourceMappingURL=vorm.js.map