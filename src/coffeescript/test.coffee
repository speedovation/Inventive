$ = jQuery

$.fn.mayon = (options) ->
  settings = $.extend
    'animationSpeed': 0,
    'transitionOpacity': true,
    'buttonSelector': '.menu-button',
    'hoverIntent': false,
    'hoverIntentTimeout': 150,
    'calcItemWidths': false,
    'hover': true
    options

  nav = $(@)

  createNav = ()->
    alert nav.attr 'id'
  
  createNav()


    
