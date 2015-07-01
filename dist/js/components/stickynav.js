var $;

$ = jQuery;

$.fn.stickynav = function(id) {
  var aArray, aChild, aChildren, ahref, i;
  if (id === null) {
    id = '#nav-anchor';
  }
  this.id = id;

  /** 
   * This part does the "fixed navigation after scroll" functionality
   * We use the jQuery function scroll() to recalculate our variables as the 
   * page is scrolled/
   */
  aArray = void 0;
  aChild = void 0;
  aChildren = void 0;
  ahref = void 0;
  i = void 0;
  $(window).scroll(function() {
    var div_top, window_top;
    div_top = void 0;
    window_top = void 0;
    window_top = $(window).scrollTop() + 12;
    div_top = 0;
    if (window_top > div_top) {
      $('nav').addClass('stick');
    } else {
      $('nav').removeClass('stick');
    }
  });

  /**
   * This part causes smooth scrolling using scrollto.js
   * We target all a tags inside the nav, and apply the scrollto.js to it.
   */
  $('nav a').click(function(evn) {
    evn.preventDefault();
    $('html,body').scrollTo(this.hash, this.hash);
  });

  /** 
   * This part handles the highlighting functionality.
   * We use the scroll functionality again, some array creation and 
   * manipulation, class adding and class removing, and conditional testing
   */
  aChildren = $('nav li').children();
  aArray = [];
  i = 0;
  while (i < aChildren.length) {
    aChild = aChildren[i];
    ahref = $(aChild).attr('href');
    aArray.push(ahref);
    i++;
  }
  return $(window).scroll(function() {
    var divHeight, divPos, docHeight, j, navActiveCurrent, theID, windowHeight, windowPos;
    j = void 0;
    divHeight = void 0;
    divPos = void 0;
    docHeight = void 0;
    navActiveCurrent = void 0;
    theID = void 0;
    windowHeight = void 0;
    windowPos = void 0;
    windowPos = $(window).scrollTop();
    windowHeight = $(window).height();
    docHeight = $(document).height();
    j = 0;
    while (j < aArray.length) {
      theID = aArray[j];
      divPos = $(theID).offset().top;
      divHeight = $(theID).height();
      if (windowPos >= divPos && windowPos < divPos + divHeight) {
        $('a[href=\'' + theID + '\']').addClass('nav-active');
      } else {
        $('a[href=\'' + theID + '\']').removeClass('nav-active');
      }
      j++;
    }
    if (windowPos + windowHeight === docHeight) {
      if (!$('nav li:last-child a').hasClass('nav-active')) {
        navActiveCurrent = $('.nav-active').attr('href');
        $('a[href=\'' + navActiveCurrent + '\']').removeClass('nav-active');
        return $('nav li:last-child a').addClass('nav-active');
      }
    }
  });
};
