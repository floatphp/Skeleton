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

		console.log(Plugin)

		// isConnected
		Plugin.func.isConnected();

		// logout
		Plugin.func.logout();

		// update
		Plugin.func.update();

		// initScroll
		initScroll();

		// initEditor
		initEditor();

	});

	// initScroll
	function initScroll() {
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

	// initEditor
	function initEditor() {
		const config = {
			"selector": 'textarea.--editable:not([disabled])',
			"license_key": 'gpl',
			"branding": false
		}
		tinymce.init(config);
	}

})(jQuery, globalVars);

/* Globals */
