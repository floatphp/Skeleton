/**
 * Lib : GeneratorCMS
 */
(function ($, Plugin) {

	'use strict';

	// Global
	Plugin.func = $.VanillePlugin.init(Plugin);

	/**
	 * Ready
	 */
	$(document).ready(function () {

		// serviceWorker
		Plugin.func.serviceWorker();

		// isConnected
		Plugin.func.isConnected();

		// login
		Plugin.func.login();

	});

})(jQuery, globalVars);
