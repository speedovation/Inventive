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



function insertPreviewBox()
{
    
    
    $( ".preview" ).slice(1).each(function(i,e) {

        //alert($(this).html())

        var content = $('.preview-template').clone();

        content.removeClass('hidden').removeClass('preview-template');
        content.find('.preview').append( $(this).html() );
        content.find('code').append( htmlEscape($(this).html()) );

       // alert( content.html() )

       $(this).removeClass('preview').addClass('preview-tab preview-wrap').html( content.html() );


    });



        // var html = (<r><![CDATA[

        // <div class="preview-tab"> 
        //     <ul class="resp-tabs-list">
        //       <li>Preview</li>
        //       <li>Html Code</li>
        //     </ul>
        //     <div class="resp-tabs-container">
        //       <div>
        //         <div class="preview">
        //           <ul class="breadcrumb">
        //             <li><a href="#">Home</a></li>
        //             <li><a href="#">Blog</a></li>
        //             <li><span>Category</span></li>
        //             <li class="active"><span>Post</span></li>
        //           </ul>
        //         </div>
        //       </div>
        //       <div>
        //         <pre class="markup"><code>
                
        //         </code></pre>
        //       </div>
        //     </div>
        //   </div>

        //   ]]></r>).toString();
}




$(function() {

// Handler for .ready() called.

    //var content = $('pre code').html();

    //$('pre code').html(htmlEscape(content));

   insertPreviewBox()

    $('.preview-tab').easyResponsiveTabs({
              //type: 'vertical',
              width: 'auto',
              fit: true
            });
    


    $( ".markup code" ).each(function(i,e) {
            //alert($(this).html())

            //old
            //var html =  $(this).parent().prev('.preview').html();

            //alert($(this).parents('.resp-tabs-container').find('.preview').html())
            //new
            var html =  $(this).parents('.resp-tabs-container').find('.preview').html();
            


             if(html)
                 html = html.replace(/            /g,'' );//.replace(/   \n/g,'' ); 
             else
                 html = $(this).html();

            $(this).html( htmlEscape(html) );
            //hljs.highlightBlock(e)

        });

});


