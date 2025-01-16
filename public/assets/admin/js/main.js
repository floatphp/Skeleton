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

		// isConnected
		Plugin.func.isConnected();

		// logout
		Plugin.func.logout();

		// update
		Plugin.func.update();

		// doScroll
		doScroll();

		// doEditor (External)
		doEditor();

	});

	// doScroll
	function doScroll() {
		$(window).scroll(function () {
			const header = $('header.header');
			if (header.length) {
				header.toggleClass('shadow-sm', $(document).scrollTop() > 0);
			}
			if ($(this).scrollTop() > 70) {
				$('.--float-control').addClass('sticky');
				$('.header-toggler').css('visibility', 'hidden');

			} else {
				$('.--float-control').removeClass('sticky');
				$('.header-toggler').css('visibility', 'visible');
			}
		});
	}

})(jQuery, globalVars);

/* Globals */
