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

		// logout
		Plugin.func.logout();

		// update
		Plugin.func.update();

		// purgeCache
		Plugin.func.purgeCache();

		// doSitemap
		doSitemap();

		// doCrawler
		doCrawler();

		// doScroll
		doScroll();

		// doSwitch
		doSwitch();

		// doEditor (External)
		doEditor();

	});

	// doSitemap
	function doSitemap() {

		const element = $('[data-name="generate-sitemap"]');
		element.on('click', function (e) {

			e.preventDefault();
			if (Plugin.func.isLoading(element)) return;

			Plugin.func.confirm({
				confirmCb: function () {

					const action = '/admin/sitemap/';
					const method = 'PUT';
					const data = { '--token': Plugin.func.token };
					const url = Plugin.func.getBaseUrl(action, true);
					const timeout = Plugin.func.timeout * 10;
					const args = { url: url, type: method, timeout: timeout, data: data };

					(Plugin.func.restful == true)
						? Plugin.func.doFetch(element, args)
						: Plugin.func.doAjax(element, args);

				}

			});

		});
	}

	// doCrawler
	function doCrawler() {

		const element = $('[data-name="crawl-website"]');
		element.on('click', function (e) {

			e.preventDefault();
			if (Plugin.func.isLoading(element)) return;

			Plugin.func.confirm({
				confirmCb: function () {

					const action = '/admin/crawl/';
					const method = 'PUT';
					const data = { '--token': Plugin.func.token };
					const url = Plugin.func.getBaseUrl(action, true);
					const timeout = Plugin.func.timeout * 10;
					const args = { url: url, type: method, timeout: timeout, data: data };

					(Plugin.func.restful == true)
						? Plugin.func.doFetch(element, args)
						: Plugin.func.doAjax(element, args);

				}

			});

		});
	}

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

	// doSwitch
	function doSwitch() {
		const element = $('input[type="checkbox"]');
		element.each(function () {
			const switcher = $(this);
			let parent = switcher.parents('.--items');
			if (!parent.length) {
				parent = switcher.parents('.card');
			}
			const input = parent.find('.--switchable');
			if (switcher.is(':checked')) {
				input.prop('disabled', false);
			} else {
				input.prop('disabled', true);
			}
		});
		element.change(function () {
			const switcher = $(this);
			let parent = switcher.parents('.--items');
			if (!parent.length) {
				parent = switcher.parents('.card');
			}
			const input = parent.find('.--switchable');
			if (switcher.is(':checked')) {
				input.prop('disabled', false);
			} else {
				input.prop('disabled', true);
			}
		});
	}

})(jQuery, globalVars);

/* Globals */
