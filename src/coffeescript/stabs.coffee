# Easy Responsive Tabs Plugin
# Author: Samson.Onna <Email : samson3d@gmail.com>
#https://github.com/samsono/Easy-Responsive-Tabs-to-Accordion

# Reference jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend
  # Change pluginName to your plugin's name.
  easyResponsiveTabs: (options) ->
    
    #Set the default values, use comma to separate the settings, example:
    defaults =
      type: "default" #default, vertical, accordion;
      width: "auto"
      fit: true
      closed: false
      activate: ->

    
    #Variables
    options = $.extend(defaults, options)
    opt = options
    jtype = opt.type
    jfit = opt.fit
    jwidth = opt.width
    vtabs = "vertical"
    accord = "accordion"
    hash = window.location.hash
    historyApi = !!(window.history and history.replaceState)
    historyApi = false

    
    #Events
    $(this).bind "tabactivate", (e, currentTab) ->
      options.activate.call currentTab, e  if typeof options.activate is "function"

    
    #Main function
    @each ->
      
      #Properties Function
      jtab_options = ->
        $respTabs.addClass "resp-vtabs"  if jtype is vtabs
        if jfit is true
          $respTabs.css
            width: "100%"
            margin: "0px"

        if jtype is accord
          $respTabs.addClass "resp-easy-accordion"
          $respTabs.find(".resp-tabs-list").css "display", "none"
      $respTabs = $(this)
      $respTabsList = $respTabs.find("ul.resp-tabs-list")
      respTabsId = $respTabs.attr("id")
      $respTabs.find("ul.resp-tabs-list li").addClass "resp-tab-item"
      $respTabs.css
        display: "block"
        width: jwidth

      $respTabs.find(".resp-tabs-container > div").addClass "resp-tab-content"
      jtab_options()
      
      #Assigning the h2 markup to accordion title
      $tabItemh2 = undefined
      $respTabs.find(".resp-tab-content").before "<h2 class='resp-accordion' role='tab'></h2>"
      itemCount = 0
      $respTabs.find(".resp-accordion").each ->
        $tabItemh2 = $(this)
        $tabItem = $respTabs.find(".resp-tab-item:eq(" + itemCount + ")")
        $accItem = $respTabs.find(".resp-accordion:eq(" + itemCount + ")")
        $accItem.append $tabItem.html()
        $accItem.data $tabItem.data()
        $tabItemh2.attr "aria-controls", "tab_item-" + (itemCount)
        itemCount++

      
      #Assigning the 'aria-controls' to Tab items
      count = 0
      $tabContent = undefined
      $respTabs.find(".resp-tab-item").each ->
        $tabItem = $(this)
        $tabItem.attr "aria-controls", "tab_item-" + (count)
        $tabItem.attr "role", "tab"
        
        #Assigning the 'aria-labelledby' attr to tab-content
        tabcount = 0
        $respTabs.find(".resp-tab-content").each ->
          $tabContent = $(this)
          $tabContent.attr "aria-labelledby", "tab_item-" + (tabcount)
          tabcount++

        count++

      
      # Show correct content area
      tabNum = 0
      unless hash is ""
        matches = hash.match(new RegExp(respTabsId + "([0-9]+)"))
        if matches isnt null and matches.length is 2
          tabNum = parseInt(matches[1], 10) - 1
          tabNum = 0  if tabNum > count
      
      #Active correct tab
      $($respTabs.find(".resp-tab-item")[tabNum]).addClass "resp-tab-active"
      
      #keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
      if options.closed isnt true and not (options.closed is "accordion" and not $respTabsList.is(":visible")) and not (options.closed is "tabs" and $respTabsList.is(":visible"))
        $($respTabs.find(".resp-accordion")[tabNum]).addClass "resp-tab-active"
        $($respTabs.find(".resp-tab-content")[tabNum]).addClass("resp-tab-content-active").attr "style", "display:block"
      
      #assign proper classes for when tabs mode is activated before making a selection in accordion mode
      else
        $($respTabs.find(".resp-tab-content")[tabNum]).addClass "resp-tab-content-active resp-accordion-closed"
      
      #Tab Click action function
      $respTabs.find("[role=tab]").each ->
        $currentTab = $(this)
        $currentTab.click ->
          $currentTab = $(this)
          $tabAria = $currentTab.attr("aria-controls")
          $respTopItems = $currentTab.parent('.resp-tabs-list')
          $respTabs = $currentTab.parent('.resp-tabs-list').next('.resp-tabs-container')
          #alert($respTopItems.text())
          #alert($respTabs.html())
          if $currentTab.hasClass("resp-accordion") and $currentTab.hasClass("resp-tab-active")
            $respTopItems.find(".resp-tab-content-active").slideUp "", ->
              $(this).addClass "resp-accordion-closed"

            $currentTab.removeClass "resp-tab-active"
            return false
          if not $currentTab.hasClass("resp-tab-active") and $currentTab.hasClass("resp-accordion")
            $respTopItems.find(".resp-tab-active").removeClass "resp-tab-active"
            $respTabs.find(".resp-tab-content-active").slideUp().removeClass "resp-tab-content-active resp-accordion-closed"
            $respTopItems.find("[aria-controls=" + $tabAria + "]").addClass "resp-tab-active"
            $respTabs.find(".resp-tab-content[aria-labelledby = " + $tabAria + "]").slideDown().addClass "resp-tab-content-active"
          else
            $respTopItems.find(".resp-tab-active").removeClass "resp-tab-active"
            $respTabs.find(".resp-tab-content-active").removeAttr("style").removeClass("resp-tab-content-active").removeClass "resp-accordion-closed"
            $respTopItems.find("[aria-controls=" + $tabAria + "]").addClass "resp-tab-active"
            $respTabs.find(".resp-tab-content[aria-labelledby = " + $tabAria + "]").addClass("resp-tab-content-active").attr "style", "display:block"
          
          #Trigger tab activation event
          $currentTab.trigger "tabactivate", $currentTab
          
          #Update Browser History
          if historyApi
            currentHash = window.location.hash
            newHash = respTabsId + (parseInt($tabAria.substring(9), 10) + 1).toString()
            unless currentHash is ""
              re = new RegExp(respTabsId + "[0-9]+")
              if currentHash.match(re)?
                newHash = currentHash.replace(re, newHash)
              else
                newHash = currentHash + "|" + newHash
            else
              newHash = "#" + newHash
            history.replaceState null, null, newHash


      
      #Window resize function                   
      $(window).resize ->
        $respTabs.find(".resp-accordion-closed").removeAttr "style"


