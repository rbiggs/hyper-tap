Hyper-tap
=========

A library for adding events and gestures to your app. It offers support for standard events, such as `mousedown`, `mouseup`, `click`, `dblclick`, `touchstart`. It also provides the following gestures for desktop and mobile: `tap`, `dbltap`, `longtap`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`.

Why Hyper-tap?
--------------

There are a lot of libraries and frameworks that use inline events as the only way to add user interaction. Where talking about this:

```html
<button onclick=doSomething>Click</button>
```

This is a pattern you'll find in many frameworks, though the details of how the write their inline events may vary. It works fine. The only problem is that it does not support event delegation. Say you have a list with 1,000 items, or even more. Having the event on every one of the list items is inefficient. Event delegation lets you register the event on the list itself and fire the callback when the event target is a list item.

Hyper-tap solves another problem for inline events -- support for gestures. If you want to have taps and swipes that work on desktop and mobile, you cannot use them inline:

```html
  <li onswiperight=swipeCallback>
```

Only "blessed" inline event handlers work.

So, How do I use this?
----------------------

Simple, first define your events, then init them when the DOM loads.

Hyper-tap has three global functions:

* defineEvents - Define events to bind
* bindEvents - Execute to init events at load time
* unBindEvent - Use to unbind an event
* trigger - Trigger an event on a designated element
* enableGestures - Execute at page load to enable gestures

Setting Up Events
-----------------

To set up events, you define each event as an object. You pass this to the `defineEvents` method. If you need to bind two or more events, enclose them in an array:

One event:

```js
defineEvents({
  event: 'click',
  element: '#btn',
  callback: function(e) {
    alert('Hello! You clicked?')
  }
})
// Remember to find your events after defining them:
bindEvents()
```

Multiple Events:

```js
// Enclose multiple events in an array:
defineEvents([
  {
    event: 'click',
    element: '#btn',
    callback: function(e) {
      alert('Hello! You clicked?')
    }
  },
  {
    event: 'click',
    element: '#list',
    targetEl: 'li',
    callback: function() {
      result.textContent = this.textContent
    }
  }
])
bindEvents()
```

Delegated Events
----------------
Normally to register an event on an element, we use the `element` attribute. Notice that in the last example we also have a `targetEl`. This makes this event delegated. The event gets registered on the list, but the event only fires when the event target is a `li`. If we didn't provide the `targetEl` property, click on any list item would return the value of the whole list. Probably not what you would want. If a `targetEl` property is provided, but no `element` value, the event will be delegated to the body tag. Depending on how you app is constructed, this may or may not affect performance. If you have very deeply deeply nested elements, say 15 - 30 elements deep, there will be a noticeable delay from the time the event start to when the callback executes. As such, try to delegate events to a parent that is close to the target elements. If the immediate parent can be re-rendered at some point, you'd want to go a level higher. Why? Memory leaks. The gestures use normal event registration: `addEventListener` to register events and gestures. If you set up a delegate on an element that will get removed or replaced, you'll need to remove that event before this happens. To remove events, do the following:


Unbinding Events
----------------

`unBindEvent(element, event, callback)`

Gestures
--------
Hyper-tap offers the following gestures: `tap`, `dbltap`, `longtap`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`. To use them up, just provide the gesture you want as the event type. You can also delegate them like normal events as explained above:

```js
defineEvents([
  {
    event: 'tap',
    element: '#btn1',
    callback: function() {
      tapResult.textContent = 'You tapped!'
      setTimeout(function() {
        tapResult.textContent = ''
      }, 1000)
    }
  },
  {
    event: 'doubletap',
    element: '#btn2',
    callback: function() {
      dblTapResult.textContent = 'You double tapped!'
      setTimeout(function() {
        dblTapResult.textContent = ''
      }, 1000)
    }
  }
])
bindEvents()
```

Triggering Events
-----------------

You can trigger an event on an element. If you have that event registered, it will execute. You can also pass data with the triggered event, which you can capture as the `data` property of the registered event's callback event. See example below:

```js
// Define event:
defineEvents([{
  element: '#myBtn',
  event: 'tap',
  callback: function(e) {
    alert('Hello, ' + e.data.name + '!')
  }
}])
bindEvents()
// Trigger event:
trigger('#myBtn', 'tap', {name: 'Joe'})

```
