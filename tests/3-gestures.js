  var defineEvents = events.defineEvents
  var bindEvents = events.bindEvents
  var unbindEvent = events.unbindEvent
  var trigger = events.trigger
  var eventStart = events.eventStart
  var eventEnd = events.eventEnd
  var eventMove = events.eventMove
  var eventCancel = events.eventCancel

  describe("Gestures Tests", function () {

  it('$(el).on("tap", callback) should capture tap event.', function () {
    /* Register tap event */
    var check1 = undefined
    var value1 = undefined
    defineEvents([{
      element: '#btn1',
      event: 'tap',
      callback: function(e) {
        check1 = e
        value1 = 'Fired by button 1'
      }
    }])
    bindEvents()
    trigger('#btn1', 'tap')
    expect(check1.type).to.equal('tap')
    expect(check1.target.nodeName).to.equal('BUTTON')
    expect(check1.target.textContent).to.equal('Button 1')
    expect(value1).to.equal('Fired by button 1')
  })

  it('$(el).on("doubletap", callback) should capture double tap event.', function () {
    /* Register double tap event */
    var check2 = undefined
    var value2 = undefined
    defineEvents([{
      element: '#btn2',
      event: 'dbltap',
      callback: function(e) {
        check2 = e
        value2 = 'Fired by button 2'
      }
    }])
    bindEvents()
    trigger('#btn2', 'dbltap')
    expect(check2.type).to.equal('dbltap')
    expect(check2.target.nodeName).to.equal('BUTTON')
    expect(check2.target.textContent).to.equal('Button 2')
    expect(value2).to.equal('Fired by button 2')
  })

  it('$(el).on("longtap", callback) should capture long tap event.', function () {
    /* Register long tap event */
    var check3 = undefined
    var value3 = undefined
    defineEvents([{
      element: '#btn3',
      event: 'longtap',
      callback: function(e) {
        check3 = e
        value3 = 'Fired by button 3'
      }
    }])
    bindEvents()
    trigger('#btn3', 'longtap')
    expect(check3.type).to.equal('longtap')
    expect(check3.target.nodeName).to.equal('BUTTON')
    expect(check3.target.textContent).to.equal('Button 3')
    expect(value3).to.equal('Fired by button 3')
  })

  it('$(el).on("swipeup", callback) should capture swipe up event.', function () {
    /* Register swipe up event */
    var check4 = undefined
    var value4 = undefined
    defineEvents([{
      element: '#btn4',
      event: 'swipeup',
      callback: function(e) {
        check4 = e
        value4 = 'Fired by button 4'
      }
    }])
    bindEvents()
    trigger('#btn4', 'swipeup')
    expect(check4.type).to.equal('swipeup')
    expect(check4.target.nodeName).to.equal('BUTTON')
    expect(check4.target.textContent).to.equal('Button 4')
    expect(value4).to.equal('Fired by button 4')
  })

  it('$(el).on("swipedown", callback) should capture swipe down event.', function () {
    /* Register swipe down event */
    var check5 = undefined
    var value5 = undefined
    defineEvents([{
      element: '#btn5',
      event: 'swipedown',
      callback: function(e) {
        check5 = e
        value5 = 'Fired by button 5'
      }
    }])
    bindEvents()
    trigger('#btn5', 'swipedown')
    expect(check5.type).to.equal('swipedown')
    expect(check5.target.nodeName).to.equal('BUTTON')
    expect(check5.target.textContent).to.equal('Button 5')
    expect(value5).to.equal('Fired by button 5')
  })

  it('$(el).on("swipe left", callback) should capture swipe left event.', function () {
    /* Register swipe left event */
    var check6 = undefined
    var value6 = undefined
    defineEvents([{
      element: '#btn6',
      event: 'swipeleft',
      callback: function(e) {
        check6 = e
        value6 = 'Fired by button 6'
      }
    }])
    bindEvents()
    trigger('#btn6', 'swipeleft')
    expect(check6.type).to.equal('swipeleft')
    expect(check6.target.nodeName).to.equal('BUTTON')
    expect(check6.target.textContent).to.equal('Button 6')
    expect(value6).to.equal('Fired by button 6')
  })

  it('$(el).on("swipe right", callback) should capture swipe right event.', function () {
    /* Register swipe right event */
    var check7 = undefined
    var value7 = undefined
    defineEvents([{
      element: '#btn7',
      event: 'swiperight',
      callback: function(e) {
        check7 = e
        value7 = 'Fired by button 7'
      }
    }])
    bindEvents()
    trigger('#btn7', 'swiperight')
    expect(check7.type).to.equal('swiperight')
    expect(check7.target.nodeName).to.equal('BUTTON')
    expect(check7.target.textContent).to.equal('Button 7')
    expect(value7).to.equal('Fired by button 7')
  })
})
