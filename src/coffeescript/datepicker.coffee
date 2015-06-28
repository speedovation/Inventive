### http://www.eyecon.ro/bootstrap-datepicker Stefan Petre, Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0 ###

!(($) ->
  # Picker object

  Datepicker = (element, options) ->
    @element = $(element)
    @format = DPGlobal.parseFormat(options.format or @element.data('date-format') or 'mm/dd/yyyy')
    @picker = $(DPGlobal.template).appendTo('body').on(click: $.proxy(@click, this))
    @isInput = @element.is('input')
    @component = if @element.is('.date') then @element.find('.add-on') else false
    if @isInput
      @element.on
        focus: $.proxy(@show, this)
        keyup: $.proxy(@update, this)
    else
      if @component
        @component.on 'click', $.proxy(@show, this)
      else
        @element.on 'click', $.proxy(@show, this)
    @minViewMode = options.minViewMode or @element.data('date-minviewmode') or 0
    if typeof @minViewMode == 'string'
      switch @minViewMode
        when 'months'
          @minViewMode = 1
        when 'years'
          @minViewMode = 2
        else
          @minViewMode = 0
          break
    @viewMode = options.viewMode or @element.data('date-viewmode') or 0
    if typeof @viewMode == 'string'
      switch @viewMode
        when 'months'
          @viewMode = 1
        when 'years'
          @viewMode = 2
        else
          @viewMode = 0
          break
    @startViewMode = @viewMode
    @weekStart = options.weekStart or @element.data('date-weekstart') or 0
    @weekEnd = if @weekStart == 0 then 6 else @weekStart - 1
    @onRender = options.onRender
    @fillDow()
    @fillMonths()
    @update()
    @showMode()
    return

  Datepicker.prototype =
    constructor: Datepicker
    show: (e) ->
      @picker.show()
      @height = if @component then @component.outerHeight() else @element.outerHeight()
      @place()
      $(window).on 'resize', $.proxy(@place, this)
      if e
        e.stopPropagation()
        e.preventDefault()
      if !@isInput
      else
      that = this
      $(document).on 'mousedown', (ev) ->
        if $(ev.target).closest('.datepicker').length == 0
          that.hide()
        return
      @element.trigger
        type: 'show'
        date: @date
      return
    hide: ->
      @picker.hide()
      $(window).off 'resize', @place
      @viewMode = @startViewMode
      @showMode()
      if !@isInput
        $(document).off 'mousedown', @hide
      #this.set();
      @element.trigger
        type: 'hide'
        date: @date
      return
    set: ->
      formated = DPGlobal.formatDate(@date, @format)
      if !@isInput
        if @component
          @element.find('input').prop 'value', formated
        @element.data 'date', formated
      else
        @element.prop 'value', formated
      return
    setValue: (newDate) ->
      if typeof newDate == 'string'
        @date = DPGlobal.parseDate(newDate, @format)
      else
        @date = new Date(newDate)
      @set()
      @viewDate = new Date(@date.getFullYear(), @date.getMonth(), 1, 0, 0, 0, 0)
      @fill()
      return
    place: ->
      offset = if @component then @component.offset() else @element.offset()
      @picker.css
        top: offset.top + @height
        left: offset.left
      return
    update: (newDate) ->
      @date = DPGlobal.parseDate( (if typeof newDate == 'string' then newDate else if @isInput then v = @element.prop('value') else @element.data('date') ),  @format)
      @viewDate = new Date(@date.getFullYear(), @date.getMonth(), 1, 0, 0, 0, 0)
      @fill()
      return
    fillDow: ->
      dowCnt = @weekStart
      html = '<tr>'
      while dowCnt < @weekStart + 7
        html += '<th class="dow">' + DPGlobal.dates.daysMin[dowCnt++ % 7] + '</th>'
      html += '</tr>'
      @picker.find('.datepicker-days thead').append html
      return
    fillMonths: ->
      html = ''
      i = 0
      while i < 12
        html += '<span class="month">' + DPGlobal.dates.monthsShort[i++] + '</span>'
      @picker.find('.datepicker-months td').append html
      return
    fill: ->
      d = new Date(@viewDate)
      year = d.getFullYear()
      month = d.getMonth()
      currentDate = @date.valueOf()
      @picker.find('.datepicker-days th:eq(1)').text DPGlobal.dates.months[month] + ' ' + year
      prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0)
      day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth())
      prevMonth.setDate day
      prevMonth.setDate day - ((prevMonth.getDay() - (@weekStart) + 7) % 7)
      nextMonth = new Date(prevMonth)
      nextMonth.setDate nextMonth.getDate() + 42
      nextMonth = nextMonth.valueOf()
      html = []
      clsName = undefined
      prevY = undefined
      prevM = undefined
      while prevMonth.valueOf() < nextMonth
        if prevMonth.getDay() == @weekStart
          html.push '<tr>'
        clsName = @onRender(prevMonth)
        prevY = prevMonth.getFullYear()
        prevM = prevMonth.getMonth()
        if prevM < month and prevY == year or prevY < year
          clsName += ' old'
        else if prevM > month and prevY == year or prevY > year
          clsName += ' new'
        if prevMonth.valueOf() == currentDate
          clsName += ' active'
        html.push '<td class="day ' + clsName + '">' + prevMonth.getDate() + '</td>'
        if prevMonth.getDay() == @weekEnd
          html.push '</tr>'
        prevMonth.setDate prevMonth.getDate() + 1
      @picker.find('.datepicker-days tbody').empty().append html.join('')
      currentYear = @date.getFullYear()
      months = @picker.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active')
      if currentYear == year
        months.eq(@date.getMonth()).addClass 'active'
      html = ''
      year = parseInt(year / 10, 10) * 10
      yearCont = @picker.find('.datepicker-years').find('th:eq(1)').text(year + '-' + year + 9).end().find('td')
      year -= 1
      i = -1
      while i < 11
        html += '<span class="year' + (if i == -1 or i == 10 then ' old' else '') + (if currentYear == year then ' active' else '') + '">' + year + '</span>'
        year += 1
        i++
      yearCont.html html
      return
    click: (e) ->
      e.stopPropagation()
      e.preventDefault()
      target = $(e.target).closest('span, td, th')
      if target.length == 1
        switch target[0].nodeName.toLowerCase()
          when 'th'
            switch target[0].className
              when 'switch'
                @showMode 1
              when 'prev', 'next'
                @viewDate['set' + DPGlobal.modes[@viewMode].navFnc].call @viewDate, @viewDate['get' + DPGlobal.modes[@viewMode].navFnc].call(@viewDate) + DPGlobal.modes[@viewMode].navStep * (if target[0].className == 'prev' then -1 else 1)
                @fill()
                @set()
          when 'span'
            if target.is('.month')
              month = target.parent().find('span').index(target)
              @viewDate.setMonth month
            else
              year = parseInt(target.text(), 10) or 0
              @viewDate.setFullYear year
            if @viewMode != 0
              @date = new Date(@viewDate)
              @element.trigger
                type: 'changeDate'
                date: @date
                viewMode: DPGlobal.modes[@viewMode].clsName
            @showMode -1
            @fill()
            @set()
          when 'td'
            if target.is('.day') and !target.is('.disabled')
              day = parseInt(target.text(), 10) or 1
              month = @viewDate.getMonth()
              if target.is('.old')
                month -= 1
              else if target.is('.new')
                month += 1
              year = @viewDate.getFullYear()
              @date = new Date(year, month, day, 0, 0, 0, 0)
              @viewDate = new Date(year, month, Math.min(28, day), 0, 0, 0, 0)
              @fill()
              @set()
              @element.trigger
                type: 'changeDate'
                date: @date
                viewMode: DPGlobal.modes[@viewMode].clsName
      return
    mousedown: (e) ->
      e.stopPropagation()
      e.preventDefault()
      return
    showMode: (dir) ->
      if dir
        @viewMode = Math.max(@minViewMode, Math.min(2, @viewMode + dir))
      @picker.find('>div').hide().filter('.datepicker-' + DPGlobal.modes[@viewMode].clsName).show()
      return

  $.fn.datepicker = (option, val) ->
    @each ->
      $this = $(this)
      data = $this.data('datepicker')
      options = typeof option == 'object' and option
      if !data
        $this.data 'datepicker', data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults, options))
      if typeof option == 'string'
        data[option] val
      return

  $.fn.datepicker.defaults = onRender: (date) ->
    ''
  $.fn.datepicker.Constructor = Datepicker
  DPGlobal = 
    modes: [
      {
        clsName: 'days'
        navFnc: 'Month'
        navStep: 1
      }
      {
        clsName: 'months'
        navFnc: 'FullYear'
        navStep: 1
      }
      {
        clsName: 'years'
        navFnc: 'FullYear'
        navStep: 10
      }
    ]
    dates:
      days: [
        'Sunday'
        'Monday'
        'Tuesday'
        'Wednesday'
        'Thursday'
        'Friday'
        'Saturday'
        'Sunday'
      ]
      daysShort: [
        'Sun'
        'Mon'
        'Tue'
        'Wed'
        'Thu'
        'Fri'
        'Sat'
        'Sun'
      ]
      daysMin: [
        'Su'
        'Mo'
        'Tu'
        'We'
        'Th'
        'Fr'
        'Sa'
        'Su'
      ]
      months: [
        'January'
        'February'
        'March'
        'April'
        'May'
        'June'
        'July'
        'August'
        'September'
        'October'
        'November'
        'December'
      ]
      monthsShort: [
        'Jan'
        'Feb'
        'Mar'
        'Apr'
        'May'
        'Jun'
        'Jul'
        'Aug'
        'Sep'
        'Oct'
        'Nov'
        'Dec'
      ]
    isLeapYear: (year) ->
      year % 4 == 0 and year % 100 != 0 or year % 400 == 0
    getDaysInMonth: (year, month) ->
      [
        31
        if DPGlobal.isLeapYear(year) then 29 else 28
        31
        30
        31
        30
        31
        31
        30
        31
        30
        31
      ][month]
    parseFormat: (format) ->
      separator = format.match(/[.\/\-\s].*?/)
      parts = format.split(/\W+/)
      if !separator or !parts or parts.length == 0
        throw new Error('Invalid date format.')
      {
        separator: separator
        parts: parts
      }
    parseDate: (date, format) ->
      parts = date.split(format.separator)
      val = undefined
      date = new Date
      date.setHours 0
      date.setMinutes 0
      date.setSeconds 0
      date.setMilliseconds 0
      if parts.length == format.parts.length
        year = date.getFullYear()
        day = date.getDate()
        month = date.getMonth()
        i = 0
        cnt = format.parts.length
        while i < cnt
          val = parseInt(parts[i], 10) or 1
          switch format.parts[i]
            when 'dd', 'd'
              day = val
              date.setDate val
            when 'mm', 'm'
              month = val - 1
              date.setMonth val - 1
            when 'yy'
              year = 2000 + val
              date.setFullYear 2000 + val
            when 'yyyy'
              year = val
              date.setFullYear val
          i++
        date = new Date(year, month, day, 0, 0, 0)
      date
    formatDate: (date, format) ->
      val = 
        d: date.getDate()
        m: date.getMonth() + 1
        yy: date.getFullYear().toString().substring(2)
        yyyy: date.getFullYear()
      val.dd = (if val.d < 10 then '0' else '') + val.d
      val.mm = (if val.m < 10 then '0' else '') + val.m
      date = []
      i = 0
      cnt = format.parts.length
      while i < cnt
        date.push val[format.parts[i]]
        i++
      date.join format.separator
    headTemplate: '<thead>' + '<tr>' + '<th class="prev">&lsaquo;</th>' + '<th colspan="5" class="switch"></th>' + '<th class="next">&rsaquo;</th>' + '</tr>' + '</thead>'
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
  DPGlobal.template = '<div class="datepicker dropdown-menu">' + '<div class="datepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + '<tbody></tbody>' + '</table>' + '</div>' + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '</div>'
  return
)(window.jQuery)


