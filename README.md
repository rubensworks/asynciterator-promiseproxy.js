# Async Promise Proxy Iterator

[![npm version](https://badge.fury.io/js/asynciterator-promiseproxy.svg)](https://www.npmjs.com/package/asynciterator-promiseproxy)

An AsyncIterator proxy that allows its source to be set via a promise.

This is useful in cases when you need to pass an iterator,
but only know its source at a later stage,
or if you want to create this source lazilly.

## Usage

```javascript
const ProxyIterator = require('asynciterator-promiseproxy');

let it = new ProxyIterator(() -> makeIterator());
it.on('data', console.log);

async function makeIterator() {
  someExpensiveOperation();
  return AsyncIterator.range(0, 10); 
}
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
