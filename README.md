Hyper-tap
----------

A library for adding events and gestures to your app. It offers support for standard events, such as `mousedown`, `mouseup`, `click`, `dblclick`, `touchstart`. It also provides the following gestures for desktop and mobile: `tap`, `dbltap`, `longtap`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`.

Why Hyper-tap?
==============

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
======================

Simple, first define your events, then init them when the DOM loads.

Hyper-tap has three global functions:

* bind - Define events to bind
* bindEvents - Execute to init events at load time
* unBindEvent - Use to unbind an event
