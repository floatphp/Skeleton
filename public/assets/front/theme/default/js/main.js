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

        // highlightShortcode (high priority)
        Plugin.func.highlightShortcode();

        // cookie
        let display = Plugin?.modules?.cookies;
        display = (display === 'on') ? true : false;
        Plugin.func.cookie(display);

        // doNavbarScroll
        Plugin.func.doNavbarScroll();

        // doNavToggle
        Plugin.func.doNavToggle();

        // click
        Plugin.func.click();

        // doSearch
        doSearch();

        // doLoadMore
        doLoadMore();

        // doScroll
        doScroll();

    });

    /**
     * Scroll
     */
    $(window).scroll(function () {

        // Navbar
        Plugin.func.doNavbarScroll();

    });

    /**
     * Resize
     */
    $(window).resize(function () {
        // ...
    });

    // doSearch
    function doSearch() {

        const form = $('form[name="search"]');
        if (!form.length) {
            return;
        }

        form.on('submit', function (e) {

            e.preventDefault();
            const form = $(this);
            if (Plugin.func.isLoading(form)) return;

            const action = form.attr('action')
                || form.data('action')
                || window.location.pathname;

            const method = form.attr('method')
                || form.data('method')
                || 'POST';

            let data = form.serializeArray();
            data.push({ name: '--token', value: Plugin.token });
            data = Plugin.func.toObject(data);

            const url = Plugin.func.getBaseUrl(action, true);
            const args = {
                url: url,
                type: method,
                data: data,
                success: function (response) {

                    const status = response?.status || 'error';

                    if (status == 'success') {
                        const slug = response?.content?.slug || '404';
                        let url = Plugin.func.getLinking('city');
                        url = Plugin.func.getBaseUrl(`${url}/${slug}/`, true);

                        Plugin.func.toStorage('search', 1, 60000);
                        Plugin.func.goTo(url);

                    } else {
                        const message = response?.message || 'error';
                        const target = form.find('.--message');
                        if (!target.length) {
                            return;
                        }
                        target.text(message).css('visibility', 'visible');
                    }
                },
                error: function () {
                    const message = Plugin.func.getString('error');
                    const target = form.find('.--message');
                    if (!target.length) {
                        return;
                    }
                    target.text(message).css('visibility', 'visible');
                }
            };

            (Plugin.restful == true)
                ? Plugin.func.doFetch(form, args)
                : Plugin.func.doAjax(form, args);

        });
    }

    // doLoadMore
    function doLoadMore() {

        const element = $('[data-load-more]');
        if (!element.length) {
            return;
        }

        element.on('click', function () {

            const el = $(this);
            if (Plugin.func.isLoading(el)) return;

            const parent = el.parents('.content').find('.row');
            const item = el.attr('data-item') || 'undefined';
            const page = parseInt(el.attr('data-page') || 0, 10);
            const limit = parseInt(el.attr('data-limit') || 0, 10);
            const code = el.attr('data-code') || '0';

            const counter = page + 1;
            el.attr('data-page', counter);

            const data = {
                code: code,
                item: item,
                page: page,
                limit: limit
            };

            const url = Plugin.func.getBaseUrl('load', true);
            const args = {
                url: url,
                type: 'GET',
                data: data,
                success: function (response) {

                    const status = response?.status || 'error';
                    if (status == 'success') {

                        const data = response?.content?.data || '';
                        parent.append(data);

                    } else {
                        el.remove();
                    }

                },
                error: function () {
                    el.remove();
                }
            };

            (Plugin.restful == true)
                ? Plugin.func.doFetch(el, args)
                : Plugin.func.doAjax(el, args);

        });
    }

    // doScroll
    function doScroll() {
        const search = Plugin.func.getStorage('search');
        console.log(search);
        if (search == 1) {
            Plugin.func.removeStorage('search');
            const btn = $('[data-target=".--form"]');
            if (btn.length) {
                btn.trigger('click');
            }
        }
    }

})(jQuery, globalVars);

/* Globals */
