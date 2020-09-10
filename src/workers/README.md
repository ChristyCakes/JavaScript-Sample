# Event workers

Event workers attach to a url conforming to the [Server-Sent Events Protocol](https://www.w3.org/TR/2015/REC-eventsource-20150203/). 

Workers extending `BaseWorker` and implement the following:

A constructor
```js
  constructor() {
    super('myEventName', url);
  };
```

An `onEvent` method
```js
    onEvent(data) {
      //... hand event
    }
```
The argument `data` is a javascript object with the format:
```js
{
  event<String>
  data:<String>
}
```

For example, this event response:
```
event: score
data: {"studentId":"Evan48","exam":11538,"score":0.6519944591580055}
```

will be passed to `onEvent` as the javascript object:
```js
{
  event: 'score'
  data: {"studentId":"Evan48","exam":11538,"score":0.6519944591580055}
}
```
