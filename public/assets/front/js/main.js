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

        // doNavbarScroll
        Plugin.func.doNavbarScroll();

        // doNavToggle
        Plugin.func.doNavToggle();

        // click
        Plugin.func.click();

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

})(jQuery, globalVars);

/* Globals */
