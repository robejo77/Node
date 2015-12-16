/*
 * ================================================================================
 * Project : Boostrap skin with material design concept
 * Version : 1.4
 * Date    : 25 Aug 2015
 * Author  : ray-design
 * ================================================================================
 */

;(function($) {
  'use strict';

  var Toaster = function(element, options) {
    this.options = $.extend({}, Toaster.DEFAULTS, options);
    this.$element  = $(element);
  }

  Toaster.DEFAULTS = {
    bounce: 'up',
    message: null,
    styleclass: 'default',
    hide: 4,
    hidebutton: false
  }

  Toaster.prototype.newToast = function(options) {
    var self = this;
    options = typeof options == 'string' ? { message: options } : options;
    options = $.extend({}, this.options, options);

    if (options.message == null) {
      return this.$element;
    }

    if (options.hide && typeof options.hide != 'number') {
      options.hide = 'manual';
    }

    var toastId = new Date().valueOf();

    var template = '<li id="' + toastId + '" class="hide bmd-floating ' + options.styleclass + '">'
          + (options.hidebutton ? '<button type="button" class="close btn-link" aria-hidden="true">×</button>' : '')
          + '<p class="bmd-toast-message">'
          + options.message + '</p></li>';

    var $toast = $(template).appendTo(this.$element);

    // close button listener
    $toast.children('.close').on('click', $.proxy(this.hide, this, toastId));

    var relatedTarget = { relatedTarget: $toast };

    var e = $.Event('show.bmd.toast', relatedTarget);

    $toast.one('webkitAnimationEnd animationend', function(e) {
      var $target = $(this);
      self.$element.trigger(e = $.Event('shown.bmd.toast', { relatedTarget: $target }));
      if (options.hide != 'manual') {
        setTimeout($.proxy(self.hide, self, toastId), options.hide * 1000);
      }
    });

    // trigger event and bounce out animation
    this.$element.trigger(e).children('li:last').removeClass('hide').addClass('bmd-toast-bounce-' + options.bounce);

    return this.$element;
  }

  Toaster.prototype.hide = function(toastId, e) {
    var self = this;
    var $toast = toastId ? this.$element.children('#' + toastId) : this.$element.children('li:first');

    // return at once if no more toasts is found
    if ($toast.length === 0) return this.$element;

    this.$element.trigger($.Event('hide.bmd.toast', { relatedTarget: $toast }));
    $toast.fadeOut('slow', function(e) {
      self.$element.trigger(e = $.Event('hidden.bmd.toast', { relatedTarget: $(this) }));
      $(this).remove();
    });

    return this.$element;
  }

  // TOASTS PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bmd.toaster')
      var options = $.extend({}, Toaster.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) {
        $this.data('bmd.toaster', (data = new Toaster(this, options)))
      } else if (option === 'hide')
        data.hide()
      else
        data.newToast(option)
    })
  }

  var old = $.fn.toaster

  $.fn.toaster             = Plugin
  $.fn.toaster.Constructor = Toaster


  // TOASTER NO CONFLICT
  // ====================

  $.fn.toaster.noConflict = function () {
    $.fn.toaster = old
    return this
  }

  // TOASTER DATA-API
  // ==================

  $(window).on('load.bmd.toaster.data-api', function () {
    $('ul.bmd-toaster').each(function () {
      var $toaster = $(this)
      Plugin.call($toaster, $toaster.data())
    })
  })

}(jQuery));