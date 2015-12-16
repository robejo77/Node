/*
 * ================================================================================
 * Project : Boostrap skin with material design concept
 * Version : 1.4.2
 * Date    : 28 Oct 2015
 * Author  : ray-design
 * ================================================================================
 */

;(function($) {
  'use strict';

  var MorphFab = function(element, options) {
    this.options = options
    this.$element  = $(element)
    this.$target = $(this.$element.data('target'))
    this.$fabParent = this.$element.parent().hasClass('.bmd-fab-speed-dial-container') || this.$element.parent()[0].nodeName == "LI" ?
      this.$element.parent() : this.$element

    if (this.$target.length) {
      var $fakeFab = this.$target.find('.bmd-morph-fab-fake')
      this.$fakeFab = $fakeFab.length > 0 ?
        $fakeFab :
        this.$element.clone().removeAttr('style').addClass('bmd-morph-fab-fake').appendTo(this.$target)
    } else {
      this.$fakeFab = null
      console.log('Morph FAB has no target="' + this.$element.data('target') + '", initialization stopped.')
      return
    }

    // handle if closed on initial stage
    this.resizeTarget()
    if (this.$target.hasClass('bmd-morph-closed')) {
      this.$fakeFab.addClass('hidden')
    } else {
      this.$fabParent.addClass('hidden')
    }

    this.eventSetup()
  }

  MorphFab.DEFAULTS = {
    stickfab: false,
    sticktarget: false,
    closemenu: false
  }

  MorphFab.prototype.toggleMenu = function(action) {
    var self = this
    if (action == 'open') {
      this.$element.closest('.bmd-sidebar').addClass('bmd-sidebar-active')
      this.$element.closest('.bmd-bottom-sheet').addClass('active')
      this.$element.closest('.bmd-fab-speed-dial-container').children('.bmd-fab-speed-dialer').addClass('press')
    } else {
      setTimeout(function() {
        self.$element.closest('.bmd-sidebar').removeClass('bmd-sidebar-active')
        self.$element.closest('.bmd-bottom-sheet').removeClass('active')
        self.$element.closest('.bmd-fab-speed-dial-container').children('.bmd-fab-speed-dialer').removeClass('press')
      }, 300)
    }
  }

  MorphFab.prototype.fabExpand = function() {
    // expand animationend handling
    this.$fakeFab.one('webkitAnimationEnd animationend', $.proxy(this.morphPostHandler, this))

    this.$target.addClass('morphing')
  }

  MorphFab.prototype.morphPostHandler = function() {
    // expanded wrap up
    if (this.$target.hasClass('morphing')) {
      this.$fakeFab.addClass('hidden')
      this.$target.removeClass('morphing expanding bmd-morph-closed').addClass('bmd-morph-expanded')
      this.$element.trigger($.Event('expanded.bmd.morphFab', { relatedTarget: this.$target }))
    } else {
    // start fab homing
      this.morphFabMove()
    }
  }

  MorphFab.prototype.morphFabArrived = function() {
    if (this.$target.hasClass('closing')) {
      // finish closing
      this.$target.removeClass('closing').addClass('bmd-morph-closed')
      this.resizeTarget()
      this.$fabParent.removeClass('invisible')
      // auto close menu
      if (this.options.closemenu) this.toggleMenu('close')
      // home done for close
      this.$fakeFab.addClass('hidden').removeClass('moving')
      this.$element.trigger($.Event('closed.bmd.morphFab', { relatedTarget: this.$target }))
    } else if (this.$fakeFab.hasClass('moving')) {
      this.$fabParent.addClass('hidden').removeClass('invisible')
      this.resetFakeStyle()
      this.$fakeFab.removeClass('moving')
      if (this.options.closemenu) this.toggleMenu('close')
      // start expanding animation at intentional delay time
      setTimeout($.proxy(this.fabExpand, this), 100)
    }
  }

  MorphFab.prototype.resetFakeStyle = function() {
    this.$fakeFab.css({
      transition: '',
      position: '',
      right: '',
      bottom: '',
      margin: '',
      top: '',
      left: ''
    })
  }

  MorphFab.prototype.morphFabMove = function() {
    if (this.$fakeFab.hasClass('moving')) return
    if (!(this.$target.hasClass('expanding') || this.$target.hasClass('closing'))) return

    var self = this
    var fakeFabOrigPos = {}
    var fabGetSet = function() {
      if (self.$target.hasClass('expanding')) {
        var currentPos = self.$element.offset()
        self.resetFakeStyle()
        // also get fake fab original position as destination
        fakeFabOrigPos = self.$fakeFab.offset()
      } else {
        var currentPos = self.$fakeFab.offset()
      }
      self.$fakeFab.css({
        transition: 'none',
        position: 'fixed',
        right: '',
        bottom: '',
        margin: 0,
        top: currentPos.top - window.pageYOffset,
        left: currentPos.left - window.pageXOffset
      })

      self.$fakeFab.one('webkitTransitionEnd transitionend', $.proxy(self.morphFabArrived, self))
    }

    this.$fakeFab.addClass('moving')

    if (this.$target.hasClass('expanding')) {
      this.targetResized.done(function() {
        self.$fakeFab.addClass('invisible').removeClass('hidden')
        fabGetSet()
        self.$fakeFab.removeClass('invisible')
        self.$fabParent.addClass('invisible')
        setTimeout(function() {
          self.$fakeFab.css({
            transition: 'all 0.2s ease-in',
            top: fakeFabOrigPos.top - window.pageYOffset,
            left: fakeFabOrigPos.left - window.window.pageXOffset
          })
        }, 100)
      })
    } else {
      this.$fabParent.addClass('invisible').removeClass('hidden')  // ready for homing
      if (!this.options.stickfab) {
        this.$fabParent.appendTo(this.$element.closest('ul'))
      }
      fabGetSet()
      setTimeout(function() {
        // special handling for child of speed dial
        // set the destination position to position of speed dialer if dial list is closed
        var $speedDialer = self.$fabParent.parent('.bmd-fab-speed-dial-list').prev('.bmd-fab-speed-dialer')
        var speedDialerPos = { top: 0, left: 0 }
        if ($speedDialer.length && !$speedDialer.hasClass('press'))
          speedDialerPos = {
            top: $speedDialer.offset().top,
            left: $speedDialer.offset().left
          }
        var destPos = {
          top: (speedDialerPos.top || self.$element.offset().top) - window.pageYOffset,
          left: (speedDialerPos.left || self.$element.offset().left) - window.pageXOffset
        }
        self.$fakeFab.css({
          transition: 'all 0.2s ease-in',
          top: destPos.top,
          left: destPos.left
        })
      }, 100)
    }
  }

  MorphFab.prototype.morphClose = function() {
    if (this.$target.hasClass('bmd-morph-closed')) return

    // close animationend handling
    this.$fakeFab.one('webkitAnimationEnd animationend', $.proxy(this.morphPostHandler, this))

    this.$fakeFab.removeClass('hidden')

    // auto open menu for fab homing
    if (this.options.closemenu) this.toggleMenu('open')

    // start closing animation
    this.$target.removeClass('bmd-morph-expanded').addClass('closing')
  }

  MorphFab.prototype.eventSetup = function() {
    var self = this

    // target listener for morphing to fab
    this.$target.find('.bmd-morph-close').on('click', function(e) {
      e.preventDefault()
      if (!$(this).hasClass('bmd-ripple')) {
        self.morphClose()
      }
    // trigger after rippling if any
    }).delegate('.bmd-ink', 'hidden.bmd.ink', function() {
      self.morphClose()
    })

    // fab listener for morphing to target
    this.$element.on('click', function(e) {
      e.preventDefault()
      self.morphExpand()
      if (!self.$element.hasClass('bmd-ripple')) self.morphFabMove()
    }).delegate('.bmd-ink', 'hidden.bmd.ink', $.proxy(self.morphFabMove, self))
  }

  MorphFab.prototype.morphExpand = function() {
    if (this.$target.hasClass('bmd-morph-expanded')) return

    this.$target.addClass('expanding')

    if (!this.options.sticktarget)
      this.$target.parent().appendTo(this.$target.parent().parent())

    this.resizeTarget()
  }

  MorphFab.prototype.resizeTarget = function() {
    this.$target.parent().css('transition', 'all .35s cubic-bezier(.55,0,.1,1)')

    if (this.$target.hasClass('expanding')) {
      var self = this
      this.targetResized = $.Deferred()
      // intentional delay for the case in relocating dom may not be complete if not stick target
      setTimeout(function() {
        self.$target.parent().one('webkitTransitionEnd transitionend', function() {
          self.targetResized.resolve(true)
        })
        self.$target.parent().css({
          width: '',
          padding: '',
          'min-height': '',
          'max-height': '',
          overflow: ''
        })
      })
    } else if (this.$target.hasClass('bmd-morph-closed')) {
      this.$target.parent().css({
        width: 0,
        padding: 0,
        'min-height': 0,
        'max-height': 0,
        overflow: 'hidden'
      })
    }
  }

  // FAB MORPH PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bmd.morphFab')
      var options = $.extend({}, MorphFab.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) {
        $this.data('bmd.morphFab', (data = new MorphFab(this, options)))
      }
      if (option == 'expand') {
        data.morphExpand()
        data.morphFabMove()
      } else if (option == 'close') {
        data.morphClose()
      }
    })
  }

  var old = $.fn.morphFab

  $.fn.morphFab             = Plugin
  $.fn.morphFab.Constructor = MorphFab


  // MORPH FAB NO CONFLICT
  // ====================

  $.fn.morphFab.noConflict = function () {
    $.fn.morphFab = old
    return this
  }

  // MORPH FAB DATA-API
  // ==================

  $(window).on('load.bmd.morphFab.data-api', function () {
    $('.bmd-morph-fab:not(.bmd-morph-fab-fake)').each(function () {
      var $morphFab = $(this)
      Plugin.call($morphFab, $morphFab.data())
    })
  })

}(jQuery));