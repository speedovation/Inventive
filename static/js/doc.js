function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function createPreviewTabs()
{
    
    $( ".preview-box" ).each(function(i,e) {

        var content = $('.preview-template').clone();
        content.removeClass('hidden').removeClass('preview-template');
        content.find('.preview').append( $(this).html() );
        content.find('code.language-markup').append( htmlEscape($(this).html()) );

        $(this) .removeClass('preview-box')
                .addClass('preview-tab')
                .html( content.html() )
                .easyResponsiveTabs({ width: 'auto', fit: true });
    
    });

}

$(function() {

    createPreviewTabs()


    //initiliase all navs
    $(".flexnav").flexNav();
    var url      = window.location.href;  
    a = url.split("/")[5].replace(".html","");
    
    //$('.left-navigations').find('a').removeClass('active')

    $('.m-' + a).find('a').addClass('active')
    
   

});


