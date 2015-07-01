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


    
htmlEscape = (str) ->
  String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace />/g, '&gt;'

htmlUnescape = (value) ->
  String(value).replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace /&amp;/g, '&'

createPreviewTabs = ->
  $('.preview-box').each (i, e) ->
    content = $('.preview-template').clone()
    content.removeClass('hidden').removeClass 'preview-template'
    content.find('.preview').append $(this).html()
    content.find('code.language-markup').append htmlEscape($(this).html())
    $(this).removeClass('preview-box').addClass('preview-tab').html(content.html()).easyResponsiveTabs
      width: 'auto'
      fit: true
    return
  return

$ ->
  createPreviewTabs()
  #initiliase all navs
  $('.flexnav').flexNav()
  url = window.location.href
  a = url.split('/')[4].split('.')[0]
  #$('.left-navigations').find('a').removeClass('active')
  $('.m-' + a).find('a').addClass 'active'
  return

