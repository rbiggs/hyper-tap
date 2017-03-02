var eventCache = []

export function defineEvents(options) {
  if (Array.isArray(options)) {
    options.forEach(function(event) {
      eventCache.push(event)
    })
  } else {
    eventCache.push({
      event: options.event,
      element: options.element,
      targetEl: options.targetEl,
      callback: options.callback
    })
  }
}

export function bindEvents(model, actions) {

  // Event delegator:
  function delegate(element, event, targetEl, callback) {
    var delegateEl
    if (!element) element = 'body'
    if (typeof element === 'string') {
      delegateEl = document.querySelector(element)
    } else if (element.nodeName) {
      delegateEl = element
    }
    var eventListener = function(e) {
      var target = e.target
      var elements = Array.prototype.slice.apply(delegateEl.querySelectorAll(targetEl))
      do {
        var len = elements.length
        for (var i = 0; i < len; i++) {
          if (target === elements[i]) {
            callback.call(elements[i], e, model, actions)
            break
          }
        }
      } while (target = target.parentNode)
    }
    delegateEl.addEventListener(event, eventListener);
  }

  eventCache.forEach(function(evt) {
    var el
    if (typeof evt.element === 'string') {
      el = document.querySelector(evt.element)
    } else {
      el = document.querySelector('body')
    }
    if (evt.targetEl) {
      delegate(evt.element, evt.event, evt.targetEl, evt.callback);
    } else {
      var callback = function(e) {
        evt.callback.call(el, e, model, actions);
      }
      el.addEventListener(evt.event, callback);
    }
  })
}

export function unBindEvent(target, event, callback) {
  if (eventCache && eventCache.length) {
    var position = eventCache.findIndex(function(event) {
      event.target === target
    });
    var element = document.querySelector(target)
    element.removeEventListener(event, this[callback])
    eventCache.splice(position, 1);
  }
}

//////////////////////////////
// GESTURES:
//////////////////////////////
/**
 * Event aliases for desktop and mobile:
 */
var eventStart = 'ontouchstart' in window && /mobile/img.test(navigator.userAgent) ? 'touchstart' : 'mousedown'
var eventEnd = 'ontouchstart' in window && /mobile/img.test(navigator.userAgent) ? 'touchend' : 'click'
var eventMove = 'ontouchstart' in window && /mobile/img.test(navigator.userAgent) ? 'touchmove' : 'mousemove'
var eventCancel = 'ontouchstart' in window && /mobile/img.test(navigator.userAgent) ? 'touchcancel' : 'mouseout'


//Ready event:
function ready(callback) {
  if (document.readyState !== 'loading') {
    callback.call(callback)
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      return callback.call(callback)
    })
  }
}

// Delegate Events:
function delegateTheEvent(options) {
  var element = options.element
  var root = options.root || document.body
  var type = options.type
  var callback = options.callback
  if (typeof root === 'string') root = document.querySelector(root)
  var eventListener = function(e) {
    var target = e.target
    var elements
    if (element.nodeType) elements = [element]
    else elements = Array.prototype.slice.apply(root.querySelectorAll(element))
    do {
      var len = elements.length
      for (var i = 0; i < len; i++) {
        if (target === elements[i]) {
          callback.call(elements[i], e)
          break
        }
      }
    } while (target = target.parentNode)
  }
  root.addEventListener(type, eventListener)
}

// Fire gesture on element:
function trigger(el, event, data) {
  if (!event) {
    console.error(errors.noEventToTrigger)
    return;
  }
  if (document.createEvent) {
    var evtObj = document.createEvent('Events')
    evtObj.initEvent(event, true, false)
    evtObj.data = data
    el.dispatchEvent(evtObj)
  }
}

var enableGestures = function() {
  var touch = {}
  var touchTimeout
  var swipeTimeout
  var tapTimeout
  var longTapDelay = 750
  var singleTapDelay = 150
  var gestureLength = 20
  if (/android/img.test(navigator.userAgent)) singleTapDelay = 200
  var longTapTimeout

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      try {
        if (touch && touch.el) {
          trigger(touch.el, 'longtap')
          touch = {}
        }
      } catch (err) {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  /**
   * Execute this after DOM loads:
   */
  (function() {
    var now
    var delta
    var body = document.body
    var twoTouches = false

    /**
     * Capture start of event:
     */
    body.addEventListener(eventStart, function(e) {
      now = Date.now()
      delta = now - (touch.last || now)
      if (e.originalEvent) e = e.originalEvent

      if (eventStart === 'mousedown') {
        touch.el = parentIfText(e.target)
        if (e.target.nodeName === 'ripple') {
          touch.el = el.target.parentNode
        }
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = e.pageX
        touch.y1 = e.pageY
        twoTouches = false

      /**
       * Detect two or more finger gestures:
       */
      } else {
        if (e.touches.length === 1) {
          if (!!e.target.disabled) return
          touch.el = parentIfText(e.touches[0].target)
          touchTimeout && clearTimeout(touchTimeout)
          touch.x1 = e.touches[0].pageX
          touch.y1 = e.touches[0].pageY
          if (e.targetTouches.length === 2) {
            twoTouches = true
          } else {
            twoTouches = false
          }
        }
      }

      if (delta > 0 && delta <= 250) {
        touch.isDoubleTap = true
      }
      touch.last = now
      longTapTimeout = setTimeout(longTap, longTapDelay)
    });

    /**
     * Capture event move:
     */
    body.addEventListener(eventMove, function(e) {
      if (e.originalEvent) e = e.originalEvent
      cancelLongTap()
      if (eventMove === 'mousemove') {
        touch.x2 = e.pageX
        touch.y2 = e.pageY
      } else {
        /**
         * One finger gesture:
         */
        if (e.touches.length === 1) {
          touch.x2 = e.touches[0].pageX
          touch.y2 = e.touches[0].pageY
          touch.move = true
        }
      }
    });

    /**
     * Capture event end:
     */
    body.addEventListener(eventEnd, function(e) {

      cancelLongTap()
      if (!!touch.el) {
        /**
         * Swipe detection:
         */
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > gestureLength) ||
          (touch.y2 && Math.abs(touch.y1 - touch.y2) > gestureLength)) {
          swipeTimeout = setTimeout(function() {
            if (touch && touch.el) {
              trigger(touch.el, 'swipe')
              trigger(touch.el, 'swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
              touch = {}
            }
          }, 0);

        /**
         * Normal tap:
         */
        } else if ('last' in touch) {
          /**
           * Delay by one tick so we can cancel the 'tap' event if 'scroll' fires:
           */
          tapTimeout = setTimeout(function() {
            /**
             * Trigger double tap immediately:
             */
            if (touch && touch.isDoubleTap) {
              if (touch && touch.el) {
                trigger(touch.el, 'doubletap')
                touch = {}
              }

            } else {
              /**
               * Trigger tap after singleTapDelay:
               */
              touchTimeout = setTimeout(function() {
                touchTimeout = null
                if (touch && touch.el && !touch.move) {
                  trigger(touch.el, 'tap')
                  touch = {}

                } else {
                  /**
                   * Touch moved so cancel tap:
                   */
                  cancelAll()
                }
              }, singleTapDelay)
            }
          }, 0)
        }

      } else {
        return
      }
    });
    body.addEventListener('touchcancel', cancelAll)
  })()
}
enableGestures()
