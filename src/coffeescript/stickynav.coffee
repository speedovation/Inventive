$ = jQuery

$.fn.stickynav = (id) ->
  if id == null
    id = '#nav-anchor'
  @id = id

  ###* 
  # This part does the "fixed navigation after scroll" functionality
  # We use the jQuery function scroll() to recalculate our variables as the 
  # page is scrolled/
  ### 

  aArray = undefined
  aChild = undefined
  aChildren = undefined
  ahref = undefined
  i = undefined
  $(window).scroll ->
    div_top = undefined
    window_top = undefined
    window_top = $(window).scrollTop() + 12
    div_top = 0;
     #$('').offset().top
    if window_top > div_top
      $('nav').addClass 'stick'
    else
      $('nav').removeClass 'stick'
    return

  ###*
  # This part causes smooth scrolling using scrollto.js
  # We target all a tags inside the nav, and apply the scrollto.js to it.
  ###

  $('nav a').click (evn) ->
    evn.preventDefault()
    $('html,body').scrollTo @hash, @hash
    return

  ###* 
  # This part handles the highlighting functionality.
  # We use the scroll functionality again, some array creation and 
  # manipulation, class adding and class removing, and conditional testing
  ###

  aChildren = $('nav li').children()
  aArray = []
  i = 0
  while i < aChildren.length
    aChild = aChildren[i]
    ahref = $(aChild).attr('href')
    aArray.push ahref
    i++
  $(window).scroll ->
    j = undefined
    divHeight = undefined
    divPos = undefined
    docHeight = undefined
    navActiveCurrent = undefined
    theID = undefined
    windowHeight = undefined
    windowPos = undefined
    windowPos = $(window).scrollTop()
    windowHeight = $(window).height()
    docHeight = $(document).height()
    j = 0
    while j < aArray.length
      theID = aArray[j]
      divPos = $(theID).offset().top
      divHeight = $(theID).height()
      if windowPos >= divPos and windowPos < divPos + divHeight
        $('a[href=\'' + theID + '\']').addClass 'nav-active'
      else
        $('a[href=\'' + theID + '\']').removeClass 'nav-active'
      j++
    if windowPos + windowHeight == docHeight
      if !$('nav li:last-child a').hasClass('nav-active')
        navActiveCurrent = $('.nav-active').attr('href')
        $('a[href=\'' + navActiveCurrent + '\']').removeClass 'nav-active'
        return $('nav li:last-child a').addClass('nav-active')


