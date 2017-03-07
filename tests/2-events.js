  var defineEvents = events.defineEvents
  var bindEvents = events.bindEvents
  var unbindEvent = events.unbindEvent
  var trigger = events.trigger
  var eventStart = events.eventStart
  var eventEnd = events.eventEnd
  var eventMove = events.eventMove
  var eventCancel = events.eventCancel

describe("Events Tests", function () {

  delay = function(milliseconds) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, milliseconds)
    })
  }

  it('events.defineEvents([{element:element, event:event, callback:callback}]) should register event on element.', function () {
    var check1 = undefined
    /* Register tap */
    defineEvents([{
      element: '#testBtn1',
      event: 'tap',
      callback: function() {
        check1 = this.textContent
      }
    }])
    bindEvents()
    trigger('#testBtn1', 'tap')
    expect(check1).to.equal('Test Button 1')
    /* Register mousedown and touchstart on same element. */
    var check2 = undefined
    defineEvents([{
      element: '#testBtn1',
      event: eventStart,
      callback: function() {
        check2 = 'This event start thingie works!'
      }
    }])

    bindEvents()
    // Fire first event again
    check1 = undefined
    trigger('#testBtn1', 'tap')
    delay(100).then(function() {
      expect(check1).to.equal('Test Button 1')
      expect(check2).to.equal('This event start thingie works!')
    })
  })

  it('Should be able to register multiple events of same type on same element.', function() {
    var check1 = undefined
    var check2 = undefined
    defineEvents([
      {
        element: '#testBtn2',
        event: 'tap',
        callback: function() {
          check1 = 'From first tap event.'
        }
      },
      {
        element: '#testBtn2',
        event: 'tap',
        callback: function() {
          check2 = 'From second tap event.'
        }
    }])
    bindEvents()
    trigger('#testBtn2', 'tap')
    delay(100).then(function() {
      expect(check1).to.equal('From first tap event.')
      expect(check2).to.equal('From second tap event.')
    })
  })

  it('Shoud be able to register different types of events on same element.', function() {
    var check1 = undefined
    var check2 = undefined
    var check3 = undefined

    defineEvents([
      {
        element: '#testBtn3',
        event: 'tap',
        callback: function() {
          check1 = 'From tap!'
        }
      },
      {
        element: '#testBtn3',
        event: 'longtap',
        callback: function() {
          check2 = 'From long tap...'
        }
      },
      {
        element: '#testBtn3',
        event: 'dbltap',
        callback: function() {
          check3 = 'You tapped twice!'
        }
      }
    ])
    bindEvents()

    trigger('#testBtn3', 'tap')
    trigger('#testBtn3', 'longtap')
    trigger('#testBtn3', 'dbltap')
    expect(check1).to.equal('From tap!')
    expect(check2).to.equal('From long tap...')
    expect(check3).to.equal('You tapped twice!')
  })

  it('events.defineEvents([{element, event, callback(e)}]) should expose event object as first parameter of callback.', function() {
    check1 = undefined
    check2 = undefined
    check3 = undefined
    check4 = undefined

    defineEvents([
      {
        element: '#testBtn4',
        event: 'tap',
        callback: function(e) {
          check1 = e.target
          check2 = e.type
          check3 = e.defaultPrevented
          check4 = e.data
        }
      }
    ])
    bindEvents()

    trigger('#testBtn4', 'tap', {msg: 'Some data to pass along.'})
    expect(check1.nodeName).to.equal('BUTTON')
    expect(check2).to.equal('tap')
    expect(check3).to.equal(false)
    expect(check4.msg).to.equal('Some data to pass along.')
  })

  it('events.defineEvents([{event, element, targetEl, callback})] should delegate events from the parent to the children.', function() {
    var ul = document.querySelector('#myList1')
    var li = Array.prototype.slice.apply(ul.children)
    var delegate = undefined
    var delegateCB = function(e) {
      delegate = this
    }
    defineEvents([{
      element: '#myList1',
      event: 'tap',
      targetEl: 'li',
      callback: delegateCB
    }])
    bindEvents()
    /* Fire event on first list item */
    trigger(li[0], 'tap')
    /* Check results, should be captured by list items */
    expect(delegate.parentNode.nodeName).to.equal('UL')
    expect(delegate.nodeType).to.equal(1)
    expect(delegate.nodeName).to.equal('LI')
    expect(delegate.textContent).to.equal('One')
    /* Fire event on third list item */
    trigger(li[2], 'tap')
    expect(delegate.parentNode.nodeName).to.equal('UL')
    expect(delegate.nodeType).to.equal(1)
    expect(delegate.nodeName).to.equal('LI')
    expect(delegate.textContent).to.equal('Three')
    /* Fire event on fourth list item */
    trigger(li[3], 'tap')
    expect(delegate.parentNode.nodeName).to.equal('UL')
    expect(delegate.nodeType).to.equal(1)
    expect(delegate.nodeName).to.equal('LI')
    expect(delegate.textContent).to.equal('Four')
    unbindEvent('#myList1', 'tap', delegateCB)
  })

  it('unbindEvent(element, event) should remove provided event from element.', function() {
    // var btn = $('#testBtn5')
    var check1 = undefined
    var check2 = undefined
    /* Register tap & dbltap events */
    function tapBtnFn(e) {
      check1 = 'The button was tapped.'
    }
    function dblTapBtnFn(e) {
      check2 = 'The button was tapped twice.'
    }
    defineEvents([
      {
        element: '#testBtn5',
        event: 'tap',
        callback: tapBtnFn
      },
      {
        element: '#testBtn5',
        event: 'dbltap',
        callback: dblTapBtnFn
      }
    ])
    bindEvents()

    /* Trigger tap */
    trigger('#testBtn5', 'tap')
    expect(check1).to.equal('The button was tapped.')
    /* Trigger double tap */
    trigger('#testBtn5', 'dbltap')
    expect(check2).to.equal('The button was tapped twice.')
    /* Remove tap event from button */
    unbindEvent('#testBtn5', 'tap', tapBtnFn)
    /* Reset check */
    check1 = undefined
    check2 = undefined
    /* Trigger tap again */
    trigger('#testBtn5', 'tap')
    /* Test result, tap should not fire */
    expect(check1).to.equal(undefined)
    /* Triger double tap */
    trigger('#testBtn5', 'dbltap')
    /* doubble tap should still fire */
    expect(check2).to.equal('The button was tapped twice.')
  })

  it('unbindEvent(event) should remove all events from element if no event provided.', function() {
    // var btn = $('#testBtn6')
    var check1 = undefined
    var check2 = undefined
    /* Register tap & dbltap events */
    function tapBtnFn(e) {
      check1 = 'The button was tapped.'
    }
    function dblTapBtnFn(e) {
      check2 = 'The button was tapped twice.'
    }
    defineEvents([
      {
        element: '#testBtn6',
        event: 'tap',
        callback: tapBtnFn
      },
      {
        element: '#testBtn6',
        event: 'dbltap',
        callback: dblTapBtnFn
      }
    ])
    bindEvents()
    /* Regiester double tap */
    /* Trigger tap */
    trigger('#testBtn6', 'tap')
    expect(check1).to.equal('The button was tapped.')
    /* Trigger double tap */
    trigger('#testBtn6', 'dbltap')
    expect(check2).to.equal('The button was tapped twice.')
    /* Remove tap event from button */
    unbindEvent('#testBtn6')
    /* Reset check */
    check1 = undefined
    check2 = undefined
    /* Trigger tap again */
    trigger('#testBtn6', 'tap')
    // Test result, tap should not fire
    expect(check1).to.equal(undefined)
    /* Triger double tap */
    trigger('#testBtn6', 'dbltap')
    /* doubble tap should not fire */
    expect(check2).to.equal(undefined)
  })

  it('unbindEvent(element, event) should remove delegated event from children.', function() {
    var ul = document.querySelector('#myList2')
    var li = Array.prototype.slice.apply(ul.children)
    var delegate1 = undefined
    var delegate2 = undefined
    /* Define tap event on list to be delegated to list items */
    function delegateFn1(e) {
      delegate1 = this
    }
    function delegateFn2(e) {
      delegate2 = this
    }
    defineEvents([
      {
        element: '#myList2',
        event: 'tap',
        targetEl: 'li',
        callback: delegateFn1
      },
      {
        element: '#myList2',
        event: 'dbltap',
        targetEl: 'li',
        callback: delegateFn2
      }
    ])
    bindEvents()
    /* Fire tap event on first list item */
    trigger(li[0], 'tap')
    /* Check results, should be captured by list items */
    expect(delegate1.parentNode.nodeName).to.equal('UL')
    expect(delegate1.nodeType).to.equal(1)
    expect(delegate1.nodeName).to.equal('LI')
    expect(delegate1.textContent).to.equal('One')
    /* Fire double tap event on first list item */
    trigger(li[0], 'dbltap')
    /* Check results, should be captured by list items */
    expect(delegate1.parentNode.nodeName).to.equal('UL')
    expect(delegate1.nodeType).to.equal(1)
    expect(delegate1.nodeName).to.equal('LI')
    expect(delegate1.textContent).to.equal('One')
    /* Undelegate the tap event */
    unbindEvent('#myList2', 'tap')
    delegate1 = undefined
    delegate2 = undefined
    /* Fire tap event on first list item */
    trigger(li[0], 'tap')
    expect(delegate1).to.equal(undefined)
    /* Fire double tap event on first list item */
    // Double tap should still fire
    trigger(li[0], 'dbltap')
    expect(delegate2.parentNode.nodeName).to.equal('UL')
    expect(delegate2.nodeType).to.equal(1)
    expect(delegate2.nodeName).to.equal('LI')
    expect(delegate2.textContent).to.equal('One')
  })

  it('unbindEvent(element) should remove all events, including delegated events, from children.', function() {
    var ul = document.querySelector('#myList3')
    var li =  Array.prototype.slice.apply(ul.children)

    var delegate1 = undefined
    var delegate2 = undefined
    /* Define tap event on list to be delegated to list items */
    function delegateFn1(e) {
      delegate1 = this
    }
    function delegateFn2(e) {
      delegate2 = this
    }
    var check = undefined
    /* Define tap event on list to be delegated to list items */
    defineEvents([
      {
        element: '#myList3',
        event: 'tap',
        targetEl: 'li',
        callback: delegateFn1
      },
      {
        element: '#myList3',
        event: 'dbltap',
        targetEl: 'li',
        callback: delegateFn2
      },
      {
        element: '#myList3',
        event: 'swipedown',
        targetEl: 'li',
        callback: function() {
          check = 'You just swiped me.'
        }
      }
    ])
    bindEvents()
    /* Define double tap event on list to be delegated to list items */
    /* Fire tap event on first list item */
    trigger(li[0], 'tap')
    /* Check results, should be captured by list item */
    expect(delegate1.parentNode.nodeName).to.equal('UL')
    expect(delegate1.nodeType).to.equal(1)
    expect(delegate1.nodeName).to.equal('LI')
    expect(delegate1.textContent).to.equal('One')
    /* Fire double tap event on first list item */
    trigger(li[0], 'dbltap')
    /* Check results, should be captured by list item */
    expect(delegate1.parentNode.nodeName).to.equal('UL')
    expect(delegate1.nodeType).to.equal(1)
    expect(delegate1.nodeName).to.equal('LI')
    expect(delegate1.textContent).to.equal('One')
    /* Fire swipe event on first list item */
    trigger(li[0], 'swipedown')
    /* Check results, should be captured by list item */
    expect(check).to.equal('You just swiped me.')
    /* Undelegate the tap event */
    unbindEvent('#myList3')
    delegate1 = undefined
    delegate2 = undefined
    check = undefined
    // Fire tap event on first list item
    trigger(li[0], 'tap')
    /* Should not have been captured */
    expect(delegate1).to.equal(undefined)
    /* Fire double tap event on first list item */
    /* Double tap should not fire */
    trigger(li[0], 'dbltap')
    /* Should not have been captured */
    expect(delegate2).to.equal(undefined)
    /* Fire swipedown even on first list item */
    trigger(li[0], 'swipedown')
    /* Should not have been captured */
    expect(check).to.equal(undefined)
  })

  it('trigger(element, event) should fire that event on element.', function() {
    var check = undefined
    /* Capture event */
    defineEvents([
      {
        element: '#testBtn7',
        event: 'tap',
        callback: function() {
          check = 'The event fired!'
        }
      }
    ])
    bindEvents()
    /* Trigger event */
    trigger('#testBtn7', 'tap')
    expect(check).to.equal('The event fired!')
  })

  it('trigger(element, event, data) should fire that event on element and pass data to the callback on the event object.', function() {
    var check = undefined
    /* Capture data from event */
    defineEvents([
      {
        element: '#testBtn8',
        event: 'tap',
        callback: function(e) {
          if (e.data) {
            check = e.data
          }
        }
      }
    ])
    bindEvents()
    /* Trigger event without data */
    trigger('#testBtn8','tap')
    expect(check).to.equal(undefined)
    /* Trigger event and pass data */
    trigger('#testBtn8','tap', {msg: 'This was sent with the triggered event.'})
    expect(check.msg).to.equal('This was sent with the triggered event.')
  })

  it('trigger(element, event) should fire delegated events on elements.', function() {
    var ul = document.querySelector('#myList4')
    var li = Array.prototype.slice.apply(ul.children)
    var check = undefined
    defineEvents([
      {
        element: '#myList4',
        targetEl: 'li',
        event: 'tap',
        callback: function(e) {
          check = 'The delegated event fired.'
        }
      }
    ])
    bindEvents()
    /* Before delegated event fires */
    expect(check).to.equal(undefined)
    /* Trigger delegated event */
    trigger(li[0],'tap')
    /* Check result */
    expect(check).to.equal('The delegated event fired.')
  })

  it('trigger(element, event, data) should fire delegated events on elements and pass data to their callback on the event object.', function() {
    var ul = document.querySelector('#myList5')
    var li = Array.prototype.slice.apply(ul.children)
    var check = undefined
    defineEvents([
      {
        element: '#myList5',
        targetEl: 'li',
        event: 'tap',
        callback: function(e) {
          check = e
        }
      }
    ])
    bindEvents()
    trigger(li[0], 'tap', {msg: 'This was passed from a triggered tap.'})
    expect(check.target.nodeName).to.equal('LI')
    expect(check.target.parentNode.nodeName).to.equal('UL')
    expect(check.data.msg).to.equal('This was passed from a triggered tap.')
    check = undefined
    /* Trigger tap on a different list item */
    trigger(li[2], 'tap', {msg: 'This was passed from a triggered tap as well.'})
    expect(check.target.nodeName).to.equal('LI')
    expect(check.target.parentNode.nodeName).to.equal('UL')
    expect(check.data.msg).to.equal('This was passed from a triggered tap as well.')
  })

})

