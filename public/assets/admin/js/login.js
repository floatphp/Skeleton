/**
 * Lib : FloatPHP Skeleton
 */
(function ($, Plugin) {

	'use strict';

	// Global
	Plugin.func = $.VanillePlugin.init(Plugin);

	/**
	 * Ready
	 */
	$(document).ready(function () {

		// isConnected
		Plugin.func.isConnected();

		// login
		Plugin.func.login();

	});

})(jQuery, globalVars);
