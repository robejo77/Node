'use strict';
/*
 * ================================================================================
 * Project : Boostrap skin with material design concept
 * Version : 1.4.2
 * Date    : 28 Oct 2015
 * Author  : ray-design
 * ================================================================================
 */

var bmd_GLOBAL = {
  popoverStateTemplate: '<div class="popover bmd-floating bmd-popover-state" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
  tooltipStateTemplate: '<div class="tooltip bmd-tooltip-state" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner bmd-floating"></div></div>'
}

var bmd_INITIAL = {
  ripple: function(selector) {
    var ink, d, x, y;
    var oInk = ['checkbox', 'radio'];

    $('body').delegate(selector, 'click', function(e) {
      var $this = $(this);
      var $fakeInputElement;
      if ($this.closest('.disabled').length > 0 || $this.siblings('input[disabled]').length > 0) return;

      if (oInk.indexOf($this.attr('type')) !== -1) {
        var $ink = $this.next('.bmd-ink');
      } else {
        var $ink = $this.find('.bmd-ink');
      }

      // create ink element if not yet existed
      if (!$ink.length) {
        if (oInk.indexOf($this.attr('type')) !== -1) {
          $fakeInputElement = $(this).next('span');
          $("<span class='bmd-ink'></span>").insertAfter($this);
          $ink = $this.next('.bmd-ink');
        } else {
          $this.prepend("<span class='bmd-ink'></span>");
          $ink = $this.find('.bmd-ink');
        }
      } else {
        $fakeInputElement = $ink.next('span');
        $ink.removeClass("bmd-animate");
      }

      // calculate the size of ripple
      if (!$ink.height() && !$ink.width()) {
        if (oInk.indexOf($this.attr('type')) !== -1) {
          d = Math.max($fakeInputElement.outerWidth(), $fakeInputElement.outerHeight());
          $ink.css({ height: d, width: d, position: 'fixed' });
        } else {
          if ($this.hasClass('bmd-switch-thumb')) {
            d = $this.outerHeight();
          } else {
            d = Math.max($this.outerWidth(), $this.outerHeight());
          }
          $ink.css({ height: d, width: d, position: 'absolute' });
        }
      }

      // position of click point
      if (oInk.indexOf($this.attr('type')) !== -1) {
        x = $fakeInputElement.offset().left;
        y = $fakeInputElement.offset().top - window.pageYOffset;
      // always center for switch thumb
      } else if ($this.hasClass('bmd-switch-thumb')) {
        x = $ink.height() / -2;
        y = 0;
      } else {
        x = e.pageX - $this.offset().left - $ink.width() / 2;
        y = e.pageY - $this.offset().top - $ink.height() / 2;
      }

      // start ripple animation and remove class when animation end
      $ink.css({ top: y+'px', left: x+'px' }).addClass('bmd-animate')
        .one('webkitAnimationEnd animationend', function(e) {
          e.stopPropagation();
          $(this).removeClass('bmd-animate').trigger('hidden.bmd.ink');
        });

      // recreate ink with new size after window resized
      $(window).on('resize', function() {
        $('.bmd-ink').remove();
      });
    });
  },
  popover: function(selector) {
    $(selector).each(function(i, el) {
      var $this = $(el);
      var state = $this.data('bmd-state');
      $this.popover({template: bmd_GLOBAL.popoverStateTemplate.replace('bmd-popover-state', 'bmd-popover-' + state)});
    });
  },
  tooltip: function(selector) {
    $(selector).each(function(i, el) {
      var $this = $(el);
      var state = $this.data('bmd-state');
      $this.tooltip({template: bmd_GLOBAL.tooltipStateTemplate.replace('bmd-tooltip-state', 'bmd-tooltip-' + state)});
    });
  },
  sidebar: function(selector) {
    var smallSidebarWidth = [];
    var $pageContainer, $toggle;

    if (!selector) selector = '';
    $pageContainer = $(selector + ' .bmd-page-container');
    $pageContainer.each(function(i, el) {
      var $el = $(el);
      // calculate small sidebar width
      smallSidebarWidth.push(parseFloat($el.css('margin-left')));
      if ($el.hasClass('bmd-allow-overflow')) {
        $el.width($el.parent().outerWidth() - smallSidebarWidth[i]);
      }
    });
    // must be always on-top if sidebar-fix is active
    if ($pageContainer.hasClass('bmd-sidebar-fix')) {
      $pageContainer.on('transitionend webkitTransitionEnd', function() {
        if ($(this).hasClass('bmd-sidebar-active'))
          $(this).closest('.bmd-sidebar').css('z-index', 999);
      });
    }
    // sidebar toggle handler
    $toggle = $(selector + ' .bmd-sidebar-toggle');
    $toggle.click(function(e) {
      e.preventDefault();
      var $target = $($(this).data('target'));

      if (!$target || !$target.hasClass('bmd-sidebar')) return;

      $target.toggleClass("bmd-sidebar-active");

      if (!$target.hasClass("bmd-sidebar-active") && $target.hasClass('bmd-sidebar-fix'))
        $target.css('z-index', -1);
    });
    if ($pageContainer.hasClass('bmd-allow-overflow')) {
      $(window).on('resize', function() {
        $pageContainer.each(function(i, el) {
          var $el = $(el);
          if ($el.hasClass('bmd-allow-overflow')) {
            $el.width($el.parent().outerWidth() - smallSidebarWidth[i]);
          }
        });
      });
    }
  },
  select: function(selector) {
    $('body').delegate(selector, 'click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var value = $this.data('value') || $this.text();
      $this.closest('.dropdown-menu').prev('.dropdown-toggle').children('.bmd-selected-value').text(value);
    });
  },
  bottomSheet: function() {
    $('body').delegate('.bmd-bottom-sheet [data-dismiss]', 'click', function(e) {
      e.preventDefault();
      var target = $(this).data('dismiss');
      if (target) $(target).removeClass('active');
    });
    $('body').delegate('[data-toggle="bmd-bottom-sheet"]', 'click', function(e) {
      e.preventDefault();
      var target = $(this).data('target');
      if (target) $(target).toggleClass('active');
    });
  },
  fabSpeedDial: function() {
    $('body').delegate('.bmd-fab-speed-dialer:not(.bmd-morph-fab)', 'click', function(e) {
      e.preventDefault();
      $(this).toggleClass('press');
    })
    $('body').delegate('.bmd-fab-speed-dial-list .bmd-fab[data-dismiss="true"]', 'click', function(e) {
      e.preventDefault();
      $(this).closest('.bmd-fab-speed-dial-container').children('.bmd-fab-speed-dialer').removeClass('press');
    });
  },
  treeview: function() {
    var $target = $('.bmd-treeview');
    var $trees = $('.bmd-treeview > .bmd-treeview-root');

    var insertIcons = function($el) {
      if ($el.length === 0) return;

      var expandedIcon = $el.data('expanded-icon'),
          collapsedIcon = $el.data('collapsed-icon');
      var itemIcon = $el.data('item-icon');
      var $itemElement;

      // insert collapsable icons markup if any
      if (expandedIcon && collapsedIcon) {
        var collapsibleIcons = '<span class="bmd-treeview-collapsed ' + collapsedIcon + '"></span> ' +
                               '<span class="bmd-treeview-expanded ' + expandedIcon + '"></span> ';
        $el.find('a[data-toggle]:not(:has(.bmd-treeview-collapsed)):not(:has(.bmd-treeview-expanded))').prepend(collapsibleIcons);
      }

      // insert item icon markup if any
      if (itemIcon) {
        $itemElement = $el.find('ul > li > a:not([data-toggle]):not(:has(.bmd-treeview-icon))');
        itemIcon = '<span class="bmd-treeview-icon ' + itemIcon + '"></span> ';
        $itemElement.prepend(itemIcon);
      }

      // stop recursive at tree ancestor
      if ($el.hasClass('bmd-treeview-root')) return;

      // recursive for parent
      insertIcons($el.parent('ul').parent('.bmd-treeview-branch, .bmd-treeview-root'));
    }
    // start to insert icon elements from the last descendant
    $trees.each(function(i, el) {
      var $el = $(el).find('.bmd-treeview-branch:last');
      insertIcons($el);
    });
  },
  inputFile: function(selector) {
    var $input = $(selector);

    $input.each(function(i, e) {
      var $inputText = $(e);
      var multiple = $inputText.is('[multiple]') ? " multiple" : "";
      var $label = $inputText.siblings('label');
      $('<input type="file" class="bmd-input"' + multiple + '>').insertAfter($label)
      .on('change', function() {
        var value = '';
        $.each(this.files, function(i, file) {
          value += file.name + ' ';
        });
        $inputText.val(value);
      });
    });
  }
}

;(function($) {

  $(document).ready(function() {
    // initial popover
    bmd_INITIAL.popover('[data-toggle="popover"][data-bmd-state]');

    // initial tooltip
    bmd_INITIAL.tooltip('[data-toggle="tooltip"][data-bmd-state]');

    // sidebar nav handling
    bmd_INITIAL.sidebar();

    // ripple handling
    bmd_INITIAL.ripple('.bmd-ripple, .bmd-ripple-only');

    // set value of dropdown select
    bmd_INITIAL.select('.bmd-select .dropdown-menu>li>a');

    // initial bottom sheet for dismiss
    bmd_INITIAL.bottomSheet();

    // FAB speed dial handling
    bmd_INITIAL.fabSpeedDial();

    // treeview handling
    bmd_INITIAL.treeview();

    // input file
    bmd_INITIAL.inputFile('.bmd-input-file');
  });

  // export for uglify
  window.bmd_GLOBAL = bmd_GLOBAL;
  window.bmd_INITIAL = bmd_INITIAL;
})(jQuery);