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


$(function() {

// Handler for .ready() called.

    //var content = $('pre code').html();

    //$('pre code').html(htmlEscape(content));


    $( "pre code" ).each(function(i,e) {
            //alert($(this).html())
            var html =  $(this).parent().prev('.preview').html();
            // if(html)
            //     html = html.replace(/\s{4}/g,'' ).replace(/   \n/g,'' ); 
            // else
            //     html = $(this).html();

            $(this).html( htmlEscape(html) );
            //hljs.highlightBlock(e)

        });

});


