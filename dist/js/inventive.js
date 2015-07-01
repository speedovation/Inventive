
/* http://www.eyecon.ro/bootstrap-datepicker Stefan Petre, Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0 */

(function() {
  !(function($) {
    var DPGlobal, Datepicker;
    Datepicker = function(element, options) {
      this.element = $(element);
      this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || 'mm/dd/yyyy');
      this.picker = $(DPGlobal.template).appendTo('body').on({
        click: $.proxy(this.click, this)
      });
      this.isInput = this.element.is('input');
      this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
      if (this.isInput) {
        this.element.on({
          focus: $.proxy(this.show, this),
          keyup: $.proxy(this.update, this)
        });
      } else {
        if (this.component) {
          this.component.on('click', $.proxy(this.show, this));
        } else {
          this.element.on('click', $.proxy(this.show, this));
        }
      }
      this.minViewMode = options.minViewMode || this.element.data('date-minviewmode') || 0;
      if (typeof this.minViewMode === 'string') {
        switch (this.minViewMode) {
          case 'months':
            this.minViewMode = 1;
            break;
          case 'years':
            this.minViewMode = 2;
            break;
          default:
            this.minViewMode = 0;
            break;
        }
      }
      this.viewMode = options.viewMode || this.element.data('date-viewmode') || 0;
      if (typeof this.viewMode === 'string') {
        switch (this.viewMode) {
          case 'months':
            this.viewMode = 1;
            break;
          case 'years':
            this.viewMode = 2;
            break;
          default:
            this.viewMode = 0;
            break;
        }
      }
      this.startViewMode = this.viewMode;
      this.weekStart = options.weekStart || this.element.data('date-weekstart') || 0;
      this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
      this.onRender = options.onRender;
      this.fillDow();
      this.fillMonths();
      this.update();
      this.showMode();
    };
    Datepicker.prototype = {
      constructor: Datepicker,
      show: function(e) {
        var that;
        this.picker.show();
        this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
        this.place();
        $(window).on('resize', $.proxy(this.place, this));
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }
        if (!this.isInput) {

        } else {

        }
        that = this;
        $(document).on('mousedown', function(ev) {
          if ($(ev.target).closest('.datepicker').length === 0) {
            that.hide();
          }
        });
        this.element.trigger({
          type: 'show',
          date: this.date
        });
      },
      hide: function() {
        this.picker.hide();
        $(window).off('resize', this.place);
        this.viewMode = this.startViewMode;
        this.showMode();
        if (!this.isInput) {
          $(document).off('mousedown', this.hide);
        }
        this.element.trigger({
          type: 'hide',
          date: this.date
        });
      },
      set: function() {
        var formated;
        formated = DPGlobal.formatDate(this.date, this.format);
        if (!this.isInput) {
          if (this.component) {
            this.element.find('input').prop('value', formated);
          }
          this.element.data('date', formated);
        } else {
          this.element.prop('value', formated);
        }
      },
      setValue: function(newDate) {
        if (typeof newDate === 'string') {
          this.date = DPGlobal.parseDate(newDate, this.format);
        } else {
          this.date = new Date(newDate);
        }
        this.set();
        this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
        this.fill();
      },
      place: function() {
        var offset;
        offset = this.component ? this.component.offset() : this.element.offset();
        this.picker.css({
          top: offset.top + this.height,
          left: offset.left
        });
      },
      update: function(newDate) {
        var v;
        this.date = DPGlobal.parseDate((typeof newDate === 'string' ? newDate : this.isInput ? v = this.element.prop('value') : this.element.data('date')), this.format);
        this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
        this.fill();
      },
      fillDow: function() {
        var dowCnt, html;
        dowCnt = this.weekStart;
        html = '<tr>';
        while (dowCnt < this.weekStart + 7) {
          html += '<th class="dow">' + DPGlobal.dates.daysMin[dowCnt++ % 7] + '</th>';
        }
        html += '</tr>';
        this.picker.find('.datepicker-days thead').append(html);
      },
      fillMonths: function() {
        var html, i;
        html = '';
        i = 0;
        while (i < 12) {
          html += '<span class="month">' + DPGlobal.dates.monthsShort[i++] + '</span>';
        }
        this.picker.find('.datepicker-months td').append(html);
      },
      fill: function() {
        var clsName, currentDate, currentYear, d, day, html, i, month, months, nextMonth, prevM, prevMonth, prevY, year, yearCont;
        d = new Date(this.viewDate);
        year = d.getFullYear();
        month = d.getMonth();
        currentDate = this.date.valueOf();
        this.picker.find('.datepicker-days th:eq(1)').text(DPGlobal.dates.months[month] + ' ' + year);
        prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0);
        day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
        prevMonth.setDate(day);
        prevMonth.setDate(day - ((prevMonth.getDay() - this.weekStart + 7) % 7));
        nextMonth = new Date(prevMonth);
        nextMonth.setDate(nextMonth.getDate() + 42);
        nextMonth = nextMonth.valueOf();
        html = [];
        clsName = void 0;
        prevY = void 0;
        prevM = void 0;
        while (prevMonth.valueOf() < nextMonth) {
          if (prevMonth.getDay() === this.weekStart) {
            html.push('<tr>');
          }
          clsName = this.onRender(prevMonth);
          prevY = prevMonth.getFullYear();
          prevM = prevMonth.getMonth();
          if (prevM < month && prevY === year || prevY < year) {
            clsName += ' old';
          } else if (prevM > month && prevY === year || prevY > year) {
            clsName += ' new';
          }
          if (prevMonth.valueOf() === currentDate) {
            clsName += ' active';
          }
          html.push('<td class="day ' + clsName + '">' + prevMonth.getDate() + '</td>');
          if (prevMonth.getDay() === this.weekEnd) {
            html.push('</tr>');
          }
          prevMonth.setDate(prevMonth.getDate() + 1);
        }
        this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
        currentYear = this.date.getFullYear();
        months = this.picker.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');
        if (currentYear === year) {
          months.eq(this.date.getMonth()).addClass('active');
        }
        html = '';
        year = parseInt(year / 10, 10) * 10;
        yearCont = this.picker.find('.datepicker-years').find('th:eq(1)').text(year + '-' + year + 9).end().find('td');
        year -= 1;
        i = -1;
        while (i < 11) {
          html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + '">' + year + '</span>';
          year += 1;
          i++;
        }
        yearCont.html(html);
      },
      click: function(e) {
        var day, month, target, year;
        e.stopPropagation();
        e.preventDefault();
        target = $(e.target).closest('span, td, th');
        if (target.length === 1) {
          switch (target[0].nodeName.toLowerCase()) {
            case 'th':
              switch (target[0].className) {
                case 'switch':
                  this.showMode(1);
                  break;
                case 'prev':
                case 'next':
                  this.viewDate['set' + DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate, this.viewDate['get' + DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1));
                  this.fill();
                  this.set();
              }
              break;
            case 'span':
              if (target.is('.month')) {
                month = target.parent().find('span').index(target);
                this.viewDate.setMonth(month);
              } else {
                year = parseInt(target.text(), 10) || 0;
                this.viewDate.setFullYear(year);
              }
              if (this.viewMode !== 0) {
                this.date = new Date(this.viewDate);
                this.element.trigger({
                  type: 'changeDate',
                  date: this.date,
                  viewMode: DPGlobal.modes[this.viewMode].clsName
                });
              }
              this.showMode(-1);
              this.fill();
              this.set();
              break;
            case 'td':
              if (target.is('.day') && !target.is('.disabled')) {
                day = parseInt(target.text(), 10) || 1;
                month = this.viewDate.getMonth();
                if (target.is('.old')) {
                  month -= 1;
                } else if (target.is('.new')) {
                  month += 1;
                }
                year = this.viewDate.getFullYear();
                this.date = new Date(year, month, day, 0, 0, 0, 0);
                this.viewDate = new Date(year, month, Math.min(28, day), 0, 0, 0, 0);
                this.fill();
                this.set();
                this.element.trigger({
                  type: 'changeDate',
                  date: this.date,
                  viewMode: DPGlobal.modes[this.viewMode].clsName
                });
              }
          }
        }
      },
      mousedown: function(e) {
        e.stopPropagation();
        e.preventDefault();
      },
      showMode: function(dir) {
        if (dir) {
          this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
        }
        this.picker.find('>div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
      }
    };
    $.fn.datepicker = function(option, val) {
      return this.each(function() {
        var $this, data, options;
        $this = $(this);
        data = $this.data('datepicker');
        options = typeof option === 'object' && option;
        if (!data) {
          $this.data('datepicker', data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults, options)));
        }
        if (typeof option === 'string') {
          data[option](val);
        }
      });
    };
    $.fn.datepicker.defaults = {
      onRender: function(date) {
        return '';
      }
    };
    $.fn.datepicker.Constructor = Datepicker;
    DPGlobal = {
      modes: [
        {
          clsName: 'days',
          navFnc: 'Month',
          navStep: 1
        }, {
          clsName: 'months',
          navFnc: 'FullYear',
          navStep: 1
        }, {
          clsName: 'years',
          navFnc: 'FullYear',
          navStep: 10
        }
      ],
      dates: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      isLeapYear: function(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      },
      getDaysInMonth: function(year, month) {
        return [31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
      },
      parseFormat: function(format) {
        var parts, separator;
        separator = format.match(/[.\/\-\s].*?/);
        parts = format.split(/\W+/);
        if (!separator || !parts || parts.length === 0) {
          throw new Error('Invalid date format.');
        }
        return {
          separator: separator,
          parts: parts
        };
      },
      parseDate: function(date, format) {
        var cnt, day, i, month, parts, val, year;
        parts = date.split(format.separator);
        val = void 0;
        date = new Date;
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (parts.length === format.parts.length) {
          year = date.getFullYear();
          day = date.getDate();
          month = date.getMonth();
          i = 0;
          cnt = format.parts.length;
          while (i < cnt) {
            val = parseInt(parts[i], 10) || 1;
            switch (format.parts[i]) {
              case 'dd':
              case 'd':
                day = val;
                date.setDate(val);
                break;
              case 'mm':
              case 'm':
                month = val - 1;
                date.setMonth(val - 1);
                break;
              case 'yy':
                year = 2000 + val;
                date.setFullYear(2000 + val);
                break;
              case 'yyyy':
                year = val;
                date.setFullYear(val);
            }
            i++;
          }
          date = new Date(year, month, day, 0, 0, 0);
        }
        return date;
      },
      formatDate: function(date, format) {
        var cnt, i, val;
        val = {
          d: date.getDate(),
          m: date.getMonth() + 1,
          yy: date.getFullYear().toString().substring(2),
          yyyy: date.getFullYear()
        };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];
        i = 0;
        cnt = format.parts.length;
        while (i < cnt) {
          date.push(val[format.parts[i]]);
          i++;
        }
        return date.join(format.separator);
      },
      headTemplate: '<thead>' + '<tr>' + '<th class="prev">&lsaquo;</th>' + '<th colspan="5" class="switch"></th>' + '<th class="next">&rsaquo;</th>' + '</tr>' + '</thead>',
      contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    DPGlobal.template = '<div class="datepicker dropdown-menu">' + '<div class="datepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + '<tbody></tbody>' + '</table>' + '</div>' + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '</div>';
  })(window.jQuery);

}).call(this);

(function() {
  (function($) {
    "use strict";
    var Herotabs, defaults, instanceId;
    instanceId = 0;
    defaults = {
      delay: 0,
      duration: 0,
      easing: "ease-in-out",
      startOn: 0,
      reverse: false,
      interactEvent: "click",
      useTouch: true,
      onSetup: null,
      onReady: null,
      css: {
        active: "is-active",
        current: "tab-current",
        navCurrent: "tab-nav-current",
        navId: "tabnav"
      },
      selectors: {
        tab: ".js-tab",
        nav: ".js-nav",
        navItem: ".js-nav-item"
      },
      zIndex: {
        bottom: 1,
        top: 2
      }
    };
    Herotabs = function(container, options) {
      this.container = container;
      this.options = options;
      this._currentTab = null;
      this._timer = null;
      this._instanceId = ++instanceId;
      this._opacityTransition = "opacity " + (parseInt(options.duration, 10) / 1000) + "s " + options.easing;
      typeof options.onSetup === "function" && options.onSetup.call(this);
      this._getDOMElements();
      if (this.nav.length > 0) {
        this._ariafy();
        this._setCurrentNav();
        this._attachNavEvents();
      }
      this._showInitialTab(options.startOn);
      this._attachKeyEvents();
      if (parseInt(options.delay, 10) > 0) {
        this.start();
        this._attachHoverEvents();
      }
      container.addClass(options.css.active);
      container[0].style.position = "relative";
      return typeof options.onReady === "function" && options.onReady.call(this);
    };
    Herotabs.prototype = {
      constructor: Herotabs,
      showTab: function(tabToShow) {
        var currentTab, duration, self, transitionProps;
        tabToShow = this._getTab(tabToShow);
        currentTab = this._currentTab;
        transitionProps = this._transitionProps;
        if (tabToShow.length === 0 || currentTab.is(tabToShow)) {
          return this;
        }
        this.tab.css(transitionProps.css, "").css("opacity", "");
        this._setTabVisibilty(currentTab, this.tab.not(currentTab));
        tabToShow.show().css({
          position: "absolute"
        });
        self = this;
        duration = parseInt(this.options.duration, 10);
        if (duration > 0) {
          currentTab.one(transitionProps.js, function() {
            return self._setTabVisibilty(tabToShow, currentTab);
          });
        } else {
          self._setTabVisibilty(tabToShow, currentTab);
        }
        currentTab.css(transitionProps.css, this._opacityTransition).css("opacity", 0);
        this.triggerEvent("herotabs.show", tabToShow);
        this._currentTab = tabToShow;
        return this;
      },
      nextTab: function() {
        var currentIndex, nextTab;
        currentIndex = this.tab.index(this._currentTab);
        nextTab = this.tab.eq(currentIndex + 1);
        nextTab = (nextTab.length > 0 ? nextTab : this.tab.eq(0));
        this.showTab(nextTab);
        this.triggerEvent("herotabs.next", nextTab);
        return this;
      },
      prevTab: function() {
        var currentIndex, prevTab;
        currentIndex = this.tab.index(this._currentTab);
        prevTab = this.tab.eq((currentIndex === 0 ? -1 : currentIndex - 1));
        this.showTab(prevTab);
        this.triggerEvent("herotabs.prev", prevTab);
        return this;
      },
      start: function() {
        var opt, reverse, self;
        opt = this.options;
        if (!opt.delay) {
          return this;
        }
        self = this;
        reverse = opt.reverse;
        this._timer = setInterval(function() {
          if (self._navItemHasFocus()) {
            return;
          }
          if (!reverse) {
            return self.nextTab();
          } else {
            return self.prevTab();
          }
        }, opt.delay);
        this.triggerEvent("herotabs.start", this._currentTab);
        return this;
      },
      stop: function() {
        clearInterval(this._timer);
        this.triggerEvent("herotabs.stop", this._currentTab);
        return this;
      },
      triggerEvent: function(eventName, tabToShow) {
        var index;
        tabToShow = this._getTab(tabToShow);
        index = this.tab.index(tabToShow);
        return this.container.trigger(eventName, {
          currentTab: tabToShow,
          currentTabIndex: index,
          currentNavItem: this.navItem.eq(index)
        });
      },
      _getDOMElements: function() {
        var element, results, selectors;
        selectors = this.options.selectors;
        results = [];
        for (element in selectors) {
          results.push(this[element] = this.container.find(selectors[element]));
        }
        return results;
      },
      _getTab: function(tab) {
        if (typeof tab !== "number") {
          return tab;
        } else {
          return this.tab.eq(tab);
        }
      },
      _showInitialTab: function(startOn) {
        var initialTab, tabFromHash;
        tabFromHash = location.hash && this.tab.filter(location.hash);
        initialTab = (tabFromHash.length === 0 ? this.tab.eq(startOn) : tabFromHash);
        this.tab.css("top", 0);
        this._setTabVisibilty(initialTab, this.tab.not(initialTab));
        this.triggerEvent("herotabs.show", initialTab);
        return this._currentTab = initialTab;
      },
      _setTabVisibilty: function(tabToShow, tabToHide) {
        var css, opt, zIndex;
        opt = this.options;
        css = opt.css;
        zIndex = opt.zIndex;
        tabToShow.addClass(css.current).css({
          "z-index": zIndex.top,
          position: "relative"
        }).attr("aria-hidden", false).find("a").andSelf().attr("tabindex", "0");
        return tabToHide.removeClass(css.current).css({
          "z-index": zIndex.bottom
        }).hide().attr("aria-hidden", true).find("a").andSelf().attr("tabindex", "-1");
      },
      _ariafy: function() {
        var navId;
        navId = this.options.css.navId + this._instanceId + "-";
        this.nav[0].setAttribute("role", "tablist");
        this.navItem.attr("role", "presentation").find("a").each(function(index) {
          this.id = navId + (index + 1);
          return this.setAttribute("role", "tab");
        });
        return this.tab.each(function(index) {
          this.setAttribute("role", "tabpanel");
          return this.setAttribute("aria-labelledby", navId + (index + 1));
        });
      },
      _transitionProps: (function() {
        var div, i, len, prefixes, prop, prop_, props, transitionend, vendorProp;
        prop = "transition";
        div = document.createElement("div");
        if (prop in div.style) {
          return {
            css: prop,
            js: "transitionend"
          };
        }
        transitionend = {
          transition: "transitionend",
          webkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend"
        };
        prefixes = ["Moz", "webkit", "O"];
        prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
        props = {};
        i = 0;
        len = prefixes.length;
        while (i < len) {
          vendorProp = prefixes[i] + prop_;
          if (vendorProp in div.style) {
            props.js = transitionend[vendorProp];
            props.css = "-" + prefixes[i].toLowerCase() + "-" + prop;
          }
          ++i;
        }
        return props;
      })(),
      _attachHoverEvents: function() {
        var self;
        self = this;
        this.container.on("mouseenter", function() {
          self.stop();
          return self.triggerEvent("herotabs.mouseenter", self._currentTab);
        });
        return this.container.on("mouseleave", function() {
          self.start();
          return self.triggerEvent("herotabs.mouseleave", self._currentTab);
        });
      },
      _attachKeyEvents: function() {
        var self;
        self = this;
        return this.nav.on("keydown", "a", function(event) {
          switch (event.keyCode) {
            case 37:
            case 38:
              return self.prevTab();
            case 39:
            case 40:
              return self.nextTab();
          }
        });
      },
      _isTouchEnabled: function() {
        return ("ontouchstart" in document.documentElement) && this.options.useTouch;
      },
      _getEventType: function() {
        var eventMap;
        eventMap = {
          hover: "mouseenter",
          touch: "touchstart",
          click: "click"
        };
        if (this._isTouchEnabled()) {
          return eventMap.touch;
        } else {
          return eventMap[this.options.interactEvent];
        }
      },
      _attachNavEvents: function() {
        var eventType, nav, opt, self;
        nav = this.nav;
        eventType = this._getEventType();
        opt = this.options;
        self = this;
        return nav.on(eventType, "a", function(event) {
          self.showTab($(this).parents(opt.selectors.navItem).index());
          if (self._checkUrlIsAnchor(this.href)) {
            event.preventDefault();
            return event.stopPropagation();
          }
        });
      },
      _isAnchorRegex: /#[A-Za-z0-9-_]+$/,
      _checkUrlIsAnchor: function(url) {
        return this._isAnchorRegex.test(url);
      },
      _navItemHasFocus: function() {
        return $(document.activeElement).closest(this.container).is(this.container);
      },
      _setCurrentNav: function() {
        var current, navItem, opt, self;
        self = this;
        opt = this.options;
        current = opt.css.navCurrent;
        navItem = this.navItem;
        return self.container.on("herotabs.show", function(event, tab) {
          var navItemLink;
          navItem.removeClass(current).find("a").each(function() {
            this.setAttribute("aria-selected", "false");
            return this.setAttribute("tabindex", "-1");
          });
          navItemLink = navItem.eq(tab.currentTabIndex).addClass(current).find("a");
          navItemLink[0].setAttribute("aria-selected", "true");
          navItemLink[0].setAttribute("tabindex", "0");
          if (self._navItemHasFocus()) {
            return navItemLink.focus();
          }
        });
      }
    };
    if (Herotabs.prototype._transitionProps.css === undefined) {
      Herotabs.prototype.showTab = function(tabToShow) {
        var currentTab, opt, self;
        tabToShow = this._getTab(tabToShow);
        currentTab = this._currentTab;
        opt = this.options;
        if (tabToShow.length === 0 || currentTab.is(tabToShow)) {
          return this;
        }
        this.tab.stop(true, true);
        tabToShow.show().css({
          position: "absolute",
          opacity: 1
        });
        self = this;
        currentTab.animate({
          opacity: 0
        }, opt.duration, function() {
          return self._setTabVisibilty(tabToShow, currentTab);
        });
        this.triggerEvent("herotabs.show", tabToShow);
        this._currentTab = tabToShow;
        return this;
      };
    }
    $.fn.herotabs = function(options) {
      options = $.extend(true, {}, defaults, options);
      return this.each(function() {
        var $this;
        $this = $(this);
        return $this.data("herotabs", new Herotabs($this, options));
      });
    };
    $.fn.herotabs.defaults = defaults;
    return $.fn.herotabs.Herotabs = Herotabs;
  })(jQuery);

}).call(this);

(function() {
  var $;

  $ = jQuery;

  $.fn.flexNav = function(options) {
    var $nav, $top_nav_items, breakpoint, count, nav_percent, nav_width, resetMenu, resizer, settings, showMenu, toggle_selector;
    settings = $.extend({
      'animationSpeed': 0,
      'transitionOpacity': true,
      'buttonSelector': '.menu-button',
      'hoverIntent': false,
      'hoverIntentTimeout': 150,
      'calcItemWidths': false,
      'hover': true
    }, options);
    $nav = $(this);
    $nav.addClass('with-js');
    if (settings.transitionOpacity === true) {
      $nav.addClass('opacity');
    }
    $nav.find("li").each(function() {
      if ($(this).has("ul").length) {
        return $(this).addClass("item-with-ul").find("ul").hide();
      }
    });
    if (settings.calcItemWidths === true) {
      $top_nav_items = $nav.find('>li');
      count = $top_nav_items.length;
      nav_width = 100 / count;
      nav_percent = nav_width + "%";
    }
    if ($nav.data('breakpoint')) {
      breakpoint = $nav.data('breakpoint');
    }
    showMenu = function() {
      if ($nav.hasClass('lg-screen') === true && settings.hover === true) {
        if (settings.transitionOpacity === true) {
          return $(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return $(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resetMenu = function() {
      if ($nav.hasClass('lg-screen') === true && $(this).find('>ul').hasClass('flexnav-show') === true && settings.hover === true) {
        if (settings.transitionOpacity === true) {
          return $(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return $(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resizer = function() {
      var selector;
      if ($(window).width() <= breakpoint) {
        $nav.removeClass("lg-screen").addClass("sm-screen");
        if (settings.calcItemWidths === true) {
          $top_nav_items.css('width', '100%');
        }
        selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
        $(selector).removeClass('active');
        return $('.one-page li a').on('click', function() {
          return $nav.removeClass('flexnav-show');
        });
      } else if ($(window).width() > breakpoint) {
        $nav.removeClass("sm-screen").addClass("lg-screen");
        if (settings.calcItemWidths === true) {
          $top_nav_items.css('width', nav_percent);
        }
        $nav.removeClass('flexnav-show').find('.item-with-ul').on();
        $('.item-with-ul').find('ul').removeClass('flexnav-show');
        resetMenu();
        if (settings.hoverIntent === true) {
          return $('.item-with-ul').hoverIntent({
            over: showMenu,
            out: resetMenu,
            timeout: settings.hoverIntentTimeout
          });
        } else if (settings.hoverIntent === false) {
          return $('.item-with-ul').on('mouseenter', showMenu).on('mouseleave', resetMenu);
        }
      }
    };
    $(settings['buttonSelector']).data('navEl', $nav);
    toggle_selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
    $(toggle_selector).on('click', function(e) {
      $(this).toggleClass('active');
      e.preventDefault();
      e.stopPropagation();
      return $(this).next('.flexnav').toggleClass('flexnav-show');
    });
    $('.item-with-ul + a').on('click', function(e) {
      var $sub, $touchButton;
      $sub = $(this).parent('.item-with-ul').find('>ul');
      $touchButton = $(this).parent('.item-with-ul').find('>span.touch-button');
      if ($nav.hasClass('lg-screen') === true) {
        $(this).parent('.item-with-ul').siblings().find('ul.flexnav-show').removeClass('flexnav-show').hide();
      }
      if ($sub.hasClass('flexnav-show') === true) {
        $sub.removeClass('flexnav-show').slideUp(settings.animationSpeed);
        $touchButton.removeClass('active');
      } else if ($sub.hasClass('flexnav-show') === false) {
        $sub.addClass('flexnav-show').slideDown(settings.animationSpeed);
        $touchButton.addClass('active');
      }
      e.preventDefault();
      return e.stopPropagation();
    });
    $nav.find('.item-with-ul *').focus(function() {
      $(this).parent('.item-with-ul').parent().find(".open").not(this).removeClass("open").hide();
      return $(this).parent('.item-with-ul').find('>ul').addClass("open").show();
    });
    resizer();
    return $(window).on('resize', resizer);
  };

}).call(this);

(function() {
  $(document).ready(function() {
    var $content, $menulink, $sidenav;
    $menulink = $('.side-menu-link');
    $sidenav = $('.oc-nav').parent();
    $content = $('.oc-content').parent();
    $menulink.click(function() {
      if ($(this).attr('class').contains('active')) {
        $sidenav.removeClass('mobile-8').addClass('mobile-12 oc-hidden');
        $('.oc-nav').removeClass('oc-nav-show');
        $content.removeClass('mobile-2').addClass('mobile-12');
        $menulink.removeClass('active');
      } else {
        $sidenav.removeClass('mobile-12 oc-hidden').addClass('mobile-8');
        $('.oc-nav').addClass('oc-nav-show');
        $content.removeClass('mobile-12').addClass('mobile-2');
        $menulink.addClass('active');
      }
      return false;
    });
  });

}).call(this);

(function() {
  var $;

  $ = jQuery;

  $.fn.extend({
    easyResponsiveTabs: function(options) {
      var accord, defaults, hash, historyApi, jfit, jtype, jwidth, opt, vtabs;
      defaults = {
        type: "default",
        width: "auto",
        fit: true,
        closed: false,
        activate: function() {}
      };
      options = $.extend(defaults, options);
      opt = options;
      jtype = opt.type;
      jfit = opt.fit;
      jwidth = opt.width;
      vtabs = "vertical";
      accord = "accordion";
      hash = window.location.hash;
      historyApi = !!(window.history && history.replaceState);
      historyApi = false;
      $(this).bind("tabactivate", function(e, currentTab) {
        if (typeof options.activate === "function") {
          return options.activate.call(currentTab, e);
        }
      });
      return this.each(function() {
        var $respTabs, $respTabsList, $tabContent, $tabItemh2, count, itemCount, jtab_options, matches, respTabsId, tabNum;
        jtab_options = function() {
          if (jtype === vtabs) {
            $respTabs.addClass("resp-vtabs");
          }
          if (jfit === true) {
            $respTabs.css({
              width: "100%",
              margin: "0px"
            });
          }
          if (jtype === accord) {
            $respTabs.addClass("resp-easy-accordion");
            return $respTabs.find(".resp-tabs-list").css("display", "none");
          }
        };
        $respTabs = $(this);
        $respTabsList = $respTabs.find("ul.resp-tabs-list");
        respTabsId = $respTabs.attr("id");
        $respTabs.find("ul.resp-tabs-list li").addClass("resp-tab-item");
        $respTabs.css({
          display: "block",
          width: jwidth
        });
        $respTabs.find(".resp-tabs-container > div").addClass("resp-tab-content");
        jtab_options();
        $tabItemh2 = void 0;
        $respTabs.find(".resp-tab-content").before("<h2 class='resp-accordion' role='tab'></h2>");
        itemCount = 0;
        $respTabs.find(".resp-accordion").each(function() {
          var $accItem, $tabItem;
          $tabItemh2 = $(this);
          $tabItem = $respTabs.find(".resp-tab-item:eq(" + itemCount + ")");
          $accItem = $respTabs.find(".resp-accordion:eq(" + itemCount + ")");
          $accItem.append($tabItem.html());
          $accItem.data($tabItem.data());
          $tabItemh2.attr("aria-controls", "tab_item-" + itemCount);
          return itemCount++;
        });
        count = 0;
        $tabContent = void 0;
        $respTabs.find(".resp-tab-item").each(function() {
          var $tabItem, tabcount;
          $tabItem = $(this);
          $tabItem.attr("aria-controls", "tab_item-" + count);
          $tabItem.attr("role", "tab");
          tabcount = 0;
          $respTabs.find(".resp-tab-content").each(function() {
            $tabContent = $(this);
            $tabContent.attr("aria-labelledby", "tab_item-" + tabcount);
            return tabcount++;
          });
          return count++;
        });
        tabNum = 0;
        if (hash !== "") {
          matches = hash.match(new RegExp(respTabsId + "([0-9]+)"));
          if (matches !== null && matches.length === 2) {
            tabNum = parseInt(matches[1], 10) - 1;
            if (tabNum > count) {
              tabNum = 0;
            }
          }
        }
        $($respTabs.find(".resp-tab-item")[tabNum]).addClass("resp-tab-active");
        if (options.closed !== true && !(options.closed === "accordion" && !$respTabsList.is(":visible")) && !(options.closed === "tabs" && $respTabsList.is(":visible"))) {
          $($respTabs.find(".resp-accordion")[tabNum]).addClass("resp-tab-active");
          $($respTabs.find(".resp-tab-content")[tabNum]).addClass("resp-tab-content-active").attr("style", "display:block");
        } else {
          $($respTabs.find(".resp-tab-content")[tabNum]).addClass("resp-tab-content-active resp-accordion-closed");
        }
        $respTabs.find("[role=tab]").each(function() {
          var $currentTab;
          $currentTab = $(this);
          return $currentTab.click(function() {
            var $respTopItems, $tabAria, currentHash, newHash, re;
            $currentTab = $(this);
            $tabAria = $currentTab.attr("aria-controls");
            $respTopItems = $currentTab.parent('.resp-tabs-list');
            $respTabs = $currentTab.parent('.resp-tabs-list').next('.resp-tabs-container');
            if ($currentTab.hasClass("resp-accordion") && $currentTab.hasClass("resp-tab-active")) {
              $respTopItems.find(".resp-tab-content-active").slideUp("", function() {
                return $(this).addClass("resp-accordion-closed");
              });
              $currentTab.removeClass("resp-tab-active");
              return false;
            }
            if (!$currentTab.hasClass("resp-tab-active") && $currentTab.hasClass("resp-accordion")) {
              $respTopItems.find(".resp-tab-active").removeClass("resp-tab-active");
              $respTabs.find(".resp-tab-content-active").slideUp().removeClass("resp-tab-content-active resp-accordion-closed");
              $respTopItems.find("[aria-controls=" + $tabAria + "]").addClass("resp-tab-active");
              $respTabs.find(".resp-tab-content[aria-labelledby = " + $tabAria + "]").slideDown().addClass("resp-tab-content-active");
            } else {
              $respTopItems.find(".resp-tab-active").removeClass("resp-tab-active");
              $respTabs.find(".resp-tab-content-active").removeAttr("style").removeClass("resp-tab-content-active").removeClass("resp-accordion-closed");
              $respTopItems.find("[aria-controls=" + $tabAria + "]").addClass("resp-tab-active");
              $respTabs.find(".resp-tab-content[aria-labelledby = " + $tabAria + "]").addClass("resp-tab-content-active").attr("style", "display:block");
            }
            $currentTab.trigger("tabactivate", $currentTab);
            if (historyApi) {
              currentHash = window.location.hash;
              newHash = respTabsId + (parseInt($tabAria.substring(9), 10) + 1).toString();
              if (currentHash !== "") {
                re = new RegExp(respTabsId + "[0-9]+");
                if (currentHash.match(re) != null) {
                  newHash = currentHash.replace(re, newHash);
                } else {
                  newHash = currentHash + "|" + newHash;
                }
              } else {
                newHash = "#" + newHash;
              }
              return history.replaceState(null, null, newHash);
            }
          });
        });
        return $(window).resize(function() {
          return $respTabs.find(".resp-accordion-closed").removeAttr("style");
        });
      });
    }
  });

}).call(this);

(function() {
  (function($) {
    var $document, $window, defaults, methods, resizer, scroller, sticked, windowHeight;
    defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: "is-sticky",
      wrapperClassName: "sticky-wrapper",
      center: false,
      getWidthFrom: ""
    };
    $window = $(window);
    $document = $(document);
    sticked = [];
    windowHeight = $window.height();
    scroller = function() {
      var documentHeight, dwh, elementTop, etse, extra, i, newTop, results, s, scrollTop;
      scrollTop = $window.scrollTop();
      documentHeight = $document.height();
      dwh = documentHeight - windowHeight;
      extra = (scrollTop > dwh ? dwh - scrollTop : 0);
      i = 0;
      results = [];
      while (i < sticked.length) {
        s = sticked[i];
        elementTop = s.stickyWrapper.offset().top;
        etse = elementTop - s.topSpacing - extra;
        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement.css("position", "").css("top", "");
            s.stickyElement.parent().removeClass(s.className);
            s.currentTop = null;
          }
        } else {
          newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            s.stickyElement.css("position", "fixed").css("top", newTop);
            if (typeof s.getWidthFrom !== "undefined") {
              s.stickyElement.css("width", $(s.getWidthFrom).width());
            }
            s.stickyElement.parent().addClass(s.className);
            s.currentTop = newTop;
          }
        }
        results.push(i++);
      }
      return results;
    };
    resizer = function() {
      return windowHeight = $window.height();
    };
    methods = {
      init: function(options) {
        var o;
        o = $.extend(defaults, options);
        return this.each(function() {
          var stickyElement, stickyId, stickyWrapper, wrapper;
          stickyElement = $(this);
          stickyId = stickyElement.attr("id");
          wrapper = $("<div></div>").attr("id", stickyId + "-sticky-wrapper").addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);
          if (o.center) {
            stickyElement.parent().css({
              width: stickyElement.outerWidth(),
              marginLeft: "auto",
              marginRight: "auto"
            });
          }
          if (stickyElement.css("float") === "right") {
            stickyElement.css({
              float: "none"
            }).parent().css({
              float: "right"
            });
          }
          stickyWrapper = stickyElement.parent();
          stickyWrapper.css("height", stickyElement.outerHeight());
          return sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            stickyWrapper: stickyWrapper,
            className: o.className,
            getWidthFrom: o.getWidthFrom
          });
        });
      },
      update: scroller
    };
    if (window.addEventListener) {
      window.addEventListener("scroll", scroller, false);
      window.addEventListener("resize", resizer, false);
    } else if (window.attachEvent) {
      window.attachEvent("onscroll", scroller);
      window.attachEvent("onresize", resizer);
    }
    $.fn.sticky = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.sticky");
      }
    };
    return $(function() {
      return setTimeout(scroller, 0);
    });
  })(jQuery);

}).call(this);

(function() {
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

}).call(this);

(function() {
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

}).call(this);
