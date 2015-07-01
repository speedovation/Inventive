var $;

$ = jQuery;

$.fn.mayon = function(options) {
  var createNav, nav, settings;
  settings = $.extend({
    'animationSpeed': 0,
    'transitionOpacity': true,
    'buttonSelector': '.menu-button',
    'hoverIntent': false,
    'hoverIntentTimeout': 150,
    'calcItemWidths': false,
    'hover': true
  }, options);
  nav = $(this);
  createNav = function() {
    return alert(nav.attr('id'));
  };
  return createNav();
};
