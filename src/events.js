function uuid() {
  var d = Date.now();
  d += performance.now();
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  var randomLetter = charset[Math.floor(Math.random() * charset.length)];
  return randomLetter + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

var eventCache = []

function bind(options) {
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

function bindEvents(model, actions) {

  // Event delegator:
  function delegate(element, event, targetEl, callback) {
    var delegateEl
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

function unBindEvent(target, event, callback) {
  if (eventCache && eventCache.length) {
    var position = eventCache.findIndex(function(event) {
      event.target === target
    });
    var element = document.querySelector(target)
    element.removeEventListener(event, this[callback])
    eventCache.splice(position, 1);
  }
}

window.bind = bind
window.bindEvents = bindEvents
window.unBindEvent = unBindEvent