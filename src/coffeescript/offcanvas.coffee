$(document).ready ->
  
  $menulink = $('.side-menu-link')

  $sidenav = $('.oc-nav').parent()
  $content = $('.oc-content').parent()
  #$wrap = $('#wrap')
  $menulink.click ->
  
    if $(this).attr('class').contains 'active'
      $sidenav.removeClass('mobile-8').addClass('mobile-12 oc-hidden')
      $('.oc-nav').removeClass 'oc-nav-show'
      $content.removeClass('mobile-2').addClass('mobile-12')
      $menulink.removeClass 'active'

    else
      $sidenav.removeClass('mobile-12 oc-hidden').addClass('mobile-8')
      $('.oc-nav').addClass 'oc-nav-show'
      $content.removeClass('mobile-12').addClass('mobile-2')
      $menulink.addClass 'active'
    #  $wrap.toggleClass 'active'
    false
  return
