/**
 * Lib : hoockableCMS
 */
(function( $, hoockableCMS ){

  "use strict";

  // Main
    // define button
    var form = 'form';
    var baseUri = window.location.origin;
    // catch submit event
    $(form).on('submit', function(e)
    {
        // prevent click
        e.preventDefault();
        // get id
        var data = $(this).serialize();
        // begin ajax call
        $.ajax({
            // ajax request config
            type: 'POST',
            url: hoockableCMS.baseUri + hoockableCMS.root + '/login/',
            cache: false,
            dataType: 'html',
            data: data,
            // callback on success
            success: function(response) {

                if (response == 'success') {
                    // toastr.success('Connecté');
                    window.location.href = hoockableCMS.baseUri + hoockableCMS.root + '/';
                }else{
                    // toastr.error('erreur d\'authentification !');
                }
            },
            // callback on error
            error: function(resultat, statut, erreur) {
                // toastr.error('Erreur systèm !');
            }
        });
    });

})( jQuery, globalVars || {} );