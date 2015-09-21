import angular from 'angular';
	
angular.module('vorm')
	.factory('VormEvent', [ '$document', '$window', function ( $document, $window ) {
		
		let VormEvent;
		
		try {
			const event = new $window.CustomEvent('foo');
			if(event) {
				VormEvent = function ( type, data ) {
					return new $window.CustomEvent(type, {
						detail: data,
						bubbles: true
					});
				};
			}
		} catch ( error ) {
			VormEvent = function ( type, data ) {
				const event = $document[0].createEvent('CustomEvent');
				event.initCustomEvent(type, true, true, data);
				return event;
			};
		}
		
		return VormEvent;
		
	}]);
