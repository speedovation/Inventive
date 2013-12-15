#!
# * jquery.herotabs
# * version 1.2.1
# * Requires jQuery 1.7.0 or higher
# * https://github.com/simonsmith/jquery.herotabs/
# * @blinkdesign
# 

# not (root, factory) ->
#   if typeof define is "function" and define.amd
#     define ["jquery"], factory
#   else
#     factory root.jQuery




# Reference jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend
  # Change pluginName to your plugin's name.
  easyResponsiveTabs: (options) ->
  "use strict"
  instanceId = 0
  defaults =
    delay: 0
    duration: 0
    easing: "ease-in-out"
    startOn: 0
    reverse: false
    interactEvent: "click"
    useTouch: true
    onSetup: null
    onReady: null
    css:
      active: "is-active"
      current: "tab-current"
      navCurrent: "tab-nav-current"
      navId: "tabnav"

    selectors:
      tab: ".js-tab"
      nav: ".js-nav"
      navItem: ".js-nav-item"

    zIndex:
      bottom: 1
      top: 2

  Herotabs = (container, options) ->
    @container = container
    @options = options
    @_currentTab = null
    @_timer = null
    @_instanceId = ++instanceId
    @_opacityTransition = "opacity " + (parseInt(options.duration, 10) / 1000) + "s " + options.easing
    typeof options.onSetup is "function" and options.onSetup.call(this)
    @_getDOMElements()
    if @nav.length > 0
      @_ariafy()
      @_setCurrentNav()
      @_attachNavEvents()
    @_showInitialTab options.startOn
    @_attachKeyEvents()
    
    # Begin cycling through tabs if a delay has been set
    if parseInt(options.delay, 10) > 0
      @start()
      @_attachHoverEvents()
    container.addClass options.css.active
    container[0].style.position = "relative"
    typeof options.onReady is "function" and options.onReady.call(this)

  Herotabs:: =
    constructor: Herotabs
    
    # Public Methods
    # ---------------------------------------
    showTab: (tabToShow) ->
      tabToShow = @_getTab(tabToShow)
      currentTab = @_currentTab
      transitionProps = @_transitionProps
      
      # Exit if there is no tab to show or the same one
      # is already showing
      return this  if tabToShow.length is 0 or currentTab.is(tabToShow)
      
      # Stop any running animations by removing properties. This
      # also stops transitionend firing if animation is halfway through
      @tab.css(transitionProps.css, "").css "opacity", ""
      
      # If animations have been stopped by the above then tab states need to
      # be manually set to their finished states had the animation been allowed
      # to complete originally.
      # This is similar to jQuery's .finish() and means
      # tabs can be cycled rapidly without overlapping animations
      @_setTabVisibilty currentTab, @tab.not(currentTab)
      
      # Prepare the next tab to be shown. This essentially ensures it is beneath the current one
      # to enable a smooth transition
      tabToShow.show().css position: "absolute"
      self = this
      duration = parseInt(@options.duration, 10)
      if duration > 0
        
        # When the animation has finished, reset the states.
        # This is important because a tab pane has position: absolute set during animation
        # and it needs to be set back after to maintain heights etc.
        currentTab.one transitionProps.js, ->
          self._setTabVisibilty tabToShow, currentTab

      else
        
        # If duration is 0s, this needs to be called manually
        # as transitionend does not fire
        self._setTabVisibilty tabToShow, currentTab
      
      # Trigger the animation
      currentTab.css(transitionProps.css, @_opacityTransition).css "opacity", 0
      @triggerEvent "herotabs.show", tabToShow
      
      # Update reference to the current tab
      @_currentTab = tabToShow
      this

    nextTab: ->
      currentIndex = @tab.index(@_currentTab)
      nextTab = @tab.eq(currentIndex + 1)
      nextTab = ((if nextTab.length > 0 then nextTab else @tab.eq(0)))
      @showTab nextTab
      @triggerEvent "herotabs.next", nextTab
      this

    prevTab: ->
      currentIndex = @tab.index(@_currentTab)
      
      # Assume that if currentIndex is 0 the first tab is currently
      # selected so grab the last one.
      prevTab = @tab.eq((if currentIndex is 0 then -1 else currentIndex - 1))
      @showTab prevTab
      @triggerEvent "herotabs.prev", prevTab
      this

    start: ->
      opt = @options
      return this  unless opt.delay
      self = this
      reverse = opt.reverse
      @_timer = setInterval(->
        return  if self._navItemHasFocus()
        unless reverse
          self.nextTab()
        else
          self.prevTab()
      , opt.delay)
      @triggerEvent "herotabs.start", @_currentTab
      this

    stop: ->
      clearInterval @_timer
      @triggerEvent "herotabs.stop", @_currentTab
      this

    triggerEvent: (eventName, tabToShow) ->
      tabToShow = @_getTab(tabToShow)
      index = @tab.index(tabToShow)
      @container.trigger eventName,
        currentTab: tabToShow
        currentTabIndex: index
        currentNavItem: @navItem.eq(index)


    
    # Private Methods
    # ---------------------------------------
    _getDOMElements: ->
      selectors = @options.selectors
      for element of selectors
        this[element] = @container.find(selectors[element])

    _getTab: (tab) ->
      (if typeof tab isnt "number" then tab else @tab.eq(tab))

    _showInitialTab: (startOn) ->
      
      # Check whether there is a tab selected by the URL hash
      tabFromHash = location.hash and @tab.filter(location.hash)
      initialTab = (if tabFromHash.length is 0 then @tab.eq(startOn) else tabFromHash)
      @tab.css "top", 0
      @_setTabVisibilty initialTab, @tab.not(initialTab)
      @triggerEvent "herotabs.show", initialTab
      @_currentTab = initialTab

    _setTabVisibilty: (tabToShow, tabToHide) ->
      opt = @options
      css = opt.css
      zIndex = opt.zIndex
      # Use .andSelf() to maintain compat with older jQuery
      tabToShow.addClass(css.current).css(
        "z-index": zIndex.top
        position: "relative"
      ).attr("aria-hidden", false).find("a").andSelf().attr "tabindex", "0"
      tabToHide.removeClass(css.current).css("z-index": zIndex.bottom).hide().attr("aria-hidden", true).find("a").andSelf().attr "tabindex", "-1"

    _ariafy: ->
      navId = @options.css.navId + @_instanceId + "-"
      @nav[0].setAttribute "role", "tablist"
      @navItem.attr("role", "presentation").find("a").each (index) ->
        @id = navId + (index + 1)
        @setAttribute "role", "tab"

      @tab.each (index) ->
        @setAttribute "role", "tabpanel"
        @setAttribute "aria-labelledby", navId + (index + 1)


    _transitionProps: (->
      prop = "transition"
      div = document.createElement("div")
      
      # Check for cool browsers first, then exit if compliant
      if prop of div.style
        return (
          css: prop
          js: "transitionend"
        )
      
      # Map of transitionend types. Sucks that it's so manual
      transitionend =
        transition: "transitionend"
        webkitTransition: "webkitTransitionEnd"
        MozTransition: "transitionend"
        OTransition: "oTransitionEnd otransitionend"

      prefixes = ["Moz", "webkit", "O"]
      prop_ = prop.charAt(0).toUpperCase() + prop.substr(1)
      props = {}
      
      # Try and find a matching prefix
      i = 0
      len = prefixes.length

      while i < len
        vendorProp = prefixes[i] + prop_
        if vendorProp of div.style
          props.js = transitionend[vendorProp]
          props.css = "-" + prefixes[i].toLowerCase() + "-" + prop
        ++i
      props
    )()
    _attachHoverEvents: ->
      self = this
      @container.on "mouseenter", ->
        self.stop()
        self.triggerEvent "herotabs.mouseenter", self._currentTab

      @container.on "mouseleave", ->
        self.start()
        self.triggerEvent "herotabs.mouseleave", self._currentTab


    _attachKeyEvents: ->
      self = this
      @nav.on "keydown", "a", (event) ->
        switch event.keyCode
          # Left
          when 37, 38 # Up
            self.prevTab()
          # Right
          when 39, 40 # Down
            self.nextTab()


    _isTouchEnabled: ->
      ("ontouchstart" of document.documentElement) and @options.useTouch

    _getEventType: ->
      eventMap =
        hover: "mouseenter"
        touch: "touchstart"
        click: "click"

      
      # If touch is supported then override the event in options
      (if @_isTouchEnabled() then eventMap.touch else eventMap[@options.interactEvent])

    _attachNavEvents: ->
      nav = @nav
      eventType = @_getEventType()
      opt = @options
      self = this
      nav.on eventType, "a", (event) ->
        self.showTab $(this).parents(opt.selectors.navItem).index()
        
        # Only preventDefault if link is an anchor.
        # Allows nav links to use external urls
        if self._checkUrlIsAnchor(@href)
          event.preventDefault()
          event.stopPropagation()


    
    # Check if url is a hash anchor e.g #foo, #foo-123 etc
    _isAnchorRegex: /#[A-Za-z0-9-_]+$/
    _checkUrlIsAnchor: (url) ->
      @_isAnchorRegex.test url

    _navItemHasFocus: ->
      
      # Only change focus if the user is focused inside the container already.
      # This stops the tabs stealing focus if the user is somewhere else
      # For example if the tabs are on a delay and the user is focused elsewhere it would be
      # annoying to have focus snap back to the tabs every time an item changed
      $(document.activeElement).closest(@container).is @container

    _setCurrentNav: ->
      self = this
      opt = @options
      current = opt.css.navCurrent
      navItem = @navItem
      self.container.on "herotabs.show", (event, tab) ->
        navItem.removeClass(current).find("a").each ->
          @setAttribute "aria-selected", "false"
          @setAttribute "tabindex", "-1"

        
        # Current nav item link
        navItemLink = navItem.eq(tab.currentTabIndex).addClass(current).find("a")
        navItemLink[0].setAttribute "aria-selected", "true"
        navItemLink[0].setAttribute "tabindex", "0"
        navItemLink.focus()  if self._navItemHasFocus()


  
  # Override showTab method if browser does not support transitions
  if Herotabs::_transitionProps.css is `undefined`
    Herotabs::showTab = (tabToShow) ->
      tabToShow = @_getTab(tabToShow)
      currentTab = @_currentTab
      opt = @options
      
      # Exit if there is no tab to show or the same one
      # is already showing
      return this  if tabToShow.length is 0 or currentTab.is(tabToShow)
      
      # Quit any running animations first
      @tab.stop true, true
      
      # The next tab to be shown needs position: absolute to allow
      # it to be under the current tab as it begins animation. Once the current tab
      # has finished animating the next tab will have position: relative reapplied
      # so it maintains the height of the herotabs in the DOM.
      tabToShow.show().css
        position: "absolute"
        opacity: 1

      
      # Animate the current tab and set visibility when
      # the animation has completed
      self = this
      currentTab.animate
        opacity: 0
      , opt.duration, ->
        self._setTabVisibilty tabToShow, currentTab

      
      # Trigger event outside of .animate()
      # Allows user to use keyboard navigation and skip a tab
      # without waiting for animations to finish
      @triggerEvent "herotabs.show", tabToShow
      
      # Update reference to the current tab
      @_currentTab = tabToShow
      this
  
  # Create the jQuery plugin
  $.fn.herotabs = (options) ->
    options = $.extend(true, {}, defaults, options)
    @each ->
      $this = $(this)
      $this.data "herotabs", new Herotabs($this, options)


  $.fn.herotabs.defaults = defaults
  $.fn.herotabs.Herotabs = Herotabs
