/*global angular*/
(function ( ) {
	
	angular.module('vorm')
		.factory('VormEvent', [ '$document', '$window', function ( $document, $window ) {
			
			var VormEvent;
			
			try {
				var event = new $window.CustomEvent('vormchange'); // jshint ignore:line
				VormEvent = function ( type, data ) {
					return new $window.CustomEvent(type, {
						detail: data
					});
				};
			} catch ( error ) {
				VormEvent = function ( type, data ) {
					var event = $document[0].createEvent('CustomEvent');
					event.initCustomEvent(type, true, true, data);
					return event;
				};
			}
			
			return VormEvent;
			
		}]);
	
})();
