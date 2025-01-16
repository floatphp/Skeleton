var doEditor = function () {
    const config = {
        selector: 'textarea.--editable:not([disabled])',
        license_key: 'gpl',
        branding: false,
        language: 'en_US',
        plugins: 'code link image lists table help preview quickbars wordcount',
        toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | link image numlist bullist |code preview help',
        relative_urls: false,
        image_advtab: false,
        help_tabs: [
            {
                name: 'shortcodes',
                title: 'Shortcodes',
                items: [
                    {
                        type: 'htmlpanel',
                        html: '<p>Domain name : [domain]</p>'
                    }
                ]
            }
        ],
        setup: function (editor) {
            editor.on('NodeChange', function (e) {
                if (e && e.element.nodeName === 'IMG') {
                    e.element.classList.add('img-fluid');
                }
            });
        }
    }
    tinymce.init(config);
}
