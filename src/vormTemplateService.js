/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.provider('vormTemplateService', [ function ( ) {
			
			var vormTemplateService = {},
				defaultWrapper,
				wrapper;
				
			defaultWrapper = `
				<div class="vorm-field"
					ng-class="vormField.getClassObj()"
					>
					<div class="vorm-field-label">
						{{vormFieldTemplate.getLabel()}}
					</div>
					
					<ul class="vorm-input-list">
						<li class="vorm-input" ng-repeat="model in vormField.getModels()">
						</li>
					</ul>
					
					<div class="vorm-field-status">
						
					</div>
				</div>
			`;
					
			
			return {
				$get: function ( ) {
					
					return vormTemplateService;
					
				}
			};
			
		}]);
	
})();
