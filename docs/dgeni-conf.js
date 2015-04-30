/*global require, __dirname,module*/
var path = require('path'),
	_ = require('lodash'),
	Package = require('dgeni').Package,
	outputFolder = 'docs';

module.exports = new Package('dgeni-example', 
	[
		require('dgeni-packages/ngdoc'),
		require('dgeni-packages/jsdoc'),
	 	require('dgeni-packages/nunjucks')
	])
	.config(function(log, readFilesProcessor, writeFilesProcessor) {

		log.level = 'error';

		readFilesProcessor.basePath = path.resolve(__dirname, '..');

		readFilesProcessor.sourceFiles = [
			{
				include: 'vorm.js'
			}
		];

		writeFilesProcessor.outputFolder  = outputFolder;
	})
	.config(function(templateFinder, templateEngine) {
		
		templateFinder.templateFolders
		      .unshift(path.resolve(__dirname, 'templates'));

		  templateFinder.templatePatterns = [
		    '${ doc.template }',
		    '${ doc.id }.${ doc.docType }.template.html',
		    '${ doc.id }.template.html',
		    '${ doc.docType }.template.html',
		    'common.template.html'
		  ];

		templateEngine.config.tags = {
			variableStart: '{$',
			variableEnd: '$}'
		};
		
		var renderer = templateEngine.getRenderer;
		
		templateEngine.getRenderer = function ( ) {
			var func = renderer.apply(this, arguments);
			
			return function ( template, data ) {
				
				var breadcrumb = [],
					nav = [],
					groups = _.filter(data.docs, { docType: 'componentGroup' });
				
				function getNavComponent ( component) {
					return {
						id: component.id,
						url: outputFolder + '/' + component.outputPath,
						label: component.name,
						isCurrentComponent: component === data.doc
					};
				}
					
				nav = _(groups)
					.map(function ( group ) {
						return {
							id: group.id,
							label: _.capitalize(group.groupType) + 's',
							children: 
								_(group.components).map(function ( component ) {
									return getNavComponent(component);
								})
								.sortBy('label')
								.value()
						};
					})
					.value();
					
				nav.unshift({
					id: 'module',
					label: 'Modules',
					children: _.filter(data.docs, { docType: 'module' })
						.map(function ( component ) {
							return getNavComponent(component);
						})
				});
					
				data = _.extend(data, {
					nav: nav
				});
				
				return func.call(this, template, data);
			};
		};
		
	})
	.config(function(getLinkInfo) {
		getLinkInfo.relativeLinks = true;
	});
