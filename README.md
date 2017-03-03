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

```js
defineEvents([
  {
    element: '#list',
    event: 'click',
    // The element you want to capture the event:
    targetEl: 'li',
    callback: function() {
      alert('You selected: ' + this.textContent)
    }
  }
])
```

With the above example, we've registered the event on the list itself and told hyperapp to execute the callback when the event target is a list item. Doing so means that `this` in the callback will refer to the target element, not the parent element. Using this technique, we can add and delete list items without worrying about binding or unbinding events, or memory leaks. If you do intent to delete or replace the list at some time, you would in that case need to unbind the delegated event from it. See below for how to unbind events.


Unbinding Events
----------------
To unbind an event, you use the `unBindEvent` method. This takes three arguments:

* element - can be a node or a CSS selector
* event - an event: 'click', 'tap', etc.
* callback - the named function used to register the event


```js
unBindEvent('#myBtn', 'tap', doSomething)
```

**ATTENTION:**

If you intend to unbind an event at any time, you must define your event's callback using a named function instead of an anonymous one. Examine these two examples carefully:

```js
// Register event with anonymous callback:
defineEvent([
  {
    element: '#btn',
    event: 'tap',
    callback: function() {
      alert('Doing something!')
    }
  }
])
bindEvents()
// Now try to unbind the above event:
unbindEvent('#btn', 'tap', callback)
/**
 * The above event cannot be unbound because the callback is anonymous.
 * To make an event unbindable, you must use a named function. Se next example:
 */
// Deine named function to use as callback:
function doSomething() {
  alert('Doing something!')
}
// Use named function in event definition:
defineEvent([
  {
    element: '#btn',
    event: 'tap',
    callback: doSomething
  }
])
bindEvents()

// Now, using named function, you can successfully unbind the event:
unbindEvent('#btn', 'tap', doSomething)

```

Unbinding Delegated Events
--------------------------
If you have a delegated event you wish to unbind, just pass in the same three values as above. You do not need to provide the target element, just the element the event is listening on:

```js
// Define named function for delegated event:
function alertListItem() {
  alert(this.textContent)
}
// Define an event for list items delegated to the parent list:
defineEvents([
  {
    element: '#list',
    event: 'dbltap',
    targetEl: 'li',
    callback: alertListItem
  }
])
bindEvents()

// Unbind delegated event, you don't need the targetEl value:
unbindEvent('#list', 'dbltap', alertListItem)
```

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
    // Access data property of event:
    alert('Hello, ' + e.data.name + '!')
  }
}])
bindEvents()
// Trigger event:
trigger('#myBtn', 'tap', {name: 'Joe'})
```

About Designating an Element for Event
--------------------------------------

It's always best to use a CSS selector that is specific to the element you wish to bind the event to. Using selectors that are generic like "p", "a", "div", "ul" can be problematic because there will probably be many instances of these in your app. Hyper-tap uses `document.querySelector` to convert a CSS selector into a node reference. This means it finds the first occurence only. If you do really want to bind an event to multiple instances of a selector, look at using a delegated event. Bind the event to the parent and provide the generic selector as the target element:

Using Hyper-tap with Hyperapp
-----------------------------
You can use hyper-tap with Hyperapp to get gestures. It easy, just include the event file in your app. Because hyper-tap needs to initialize things when the page loads, you want to set up your events and gestures using Hyperapp's `subscriptions` object. Define your events inside inside a function in your app's `subscriptions` property. To pass Hyperapp's model and actions reference to your callbacks, use bind when defining your events inside you Hyperapp code to pass a reference to Hyperapp's `model` and `actions` properties:

```js
  subscriptions: [
    (model, actions) => {
      defineEvents([
        {
          element: '#btn',
          event: 'click',
          callback: saySomething.bind(this, model, actions)
        }
      ])
```

After doing the above, inside your `saySomething` callback you can access the model and actions like this:

```js
// Define named functions as callbacks:
function saySomething(model, actions, e) {
  console.dir(model.people)
  var num = model.people.length
  console.log('The number of people is: ' + num + '.')
}
```

Please note, when you bind the model and actions to your callback, you loose the direct reference to the event target through the `this` keyword. However you can still access it through the event:

```js
function clickListItem(model, e) {
  // Get the id of the element tapped on:
  var id = e.target.id
  var choice = model.people.filter(function(person) {
    return person.id === id;
  })[0]
  document.querySelector('#result').textContent = choice.name
  e.target.classList.add('selected')
  setTimeout(function() {
    e.target.classList.remove('selected')
    document.querySelector('#result').textContent = ''
  }, 500)
}
```

```js
const h = hyperapp.h
const app = hyperapp.app
const html = hyperx(h)
const defineEvents = events.defineEvents
const bindEvents = events.bindEvents

// Define named functions as callbacks:
function saySomething(model, e) {
  console.dir(model.people)
  const num = model.people.length
  console.log('The number of people is: ' + num + '.')
}

function clickListItem(model, e) {
  const id = e.target.id
  const choice = model.people.filter(person => person.id === id)[0]
  document.querySelector('#result').textContent = choice.name
  e.target.classList.add('selected')
  setTimeout(() => {
    e.target.classList.remove('selected')
    document.querySelector('#result').textContent = ''
  }, 500)
}

app({
  model: {
    people: [
      {
        id: '100',
        name: 'Joe',
        job: 'Mechanic'
      },
      {
        id: '101',
        name: 'Ellen',
        job: 'Lab Technician'
      },
      {
        id: '102',
        name: 'Sam',
        job: 'Developer'
      }
    ]
  },
  view: (model, msg) =>
    html`
      <section>
        <h1>People</h1>
        <h4>Swipe Right to Chose a Person</h4>
        <p>
          <button id='btn'>Click</button>
        </p>
        <ul id='list'>
          ${model.people.map(person => html`<li id='${person.id}'>${person.name}</li>`)}
        </ul>
        <p>You chose: <span id='result'></span></p>
      </section>
    `,
  subscriptions: [
    (model, actions) => {
      defineEvents([
        {
          element: '#btn',
          event: 'click',
          callback: saySomething.bind(this, model)
        },
        {
          element: '#list',
          targetEl: 'li',
          event: 'click',
          callback: clickListItem.bind(this, model)
        }
      ])
      bindEvents(model, actions)
    }
  ]
})
```
