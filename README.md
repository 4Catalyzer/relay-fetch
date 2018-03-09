# Relay Fetch [![npm][npm-badge]][npm]

Relay Modern network fetch functions.

## Usage

Wrap the `fetchQuery` function you pass into Relay Modern's `Network.create` with the helpers here to enhance their functionality.

## Guide

### Installation

```
$ npm i -S relay-fetch
```

### Server-side rendering

The most straightforward way to handle data hydration when doing server-side rendering with Relay Modern is to send the server-side network responses to the client, then to hydrate them on the client and use them as a request cache for the initial client-side render. Use `recordPayloads` and `replayPayloads` to respectively record and replay the response payloads to accomplish this.

On the server, wrap your base `fetchQuery` function with `recordPayloads`, then serialize the wrapped `fetchQuery` to the DOM. Make sure to set the value before loading your main code bundle.

```js
import { recordPayloads } from 'relay-fetch';
import { Network } from 'relay-runtime';
import serialize from 'serialize-javascript';

/* ... */

const fetchQuery = recordPayloads(baseFetchQuery);
const network = Network.create(fetchQuery);

/* ... */

res.send(`
<!DOCTYPE html>
<html>

<head>
  <title>Relay Fetch server-side rendering example</title>
</head>

<body>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script>
  window.__RELAY_PAYLOADS__ = ${serialize(fetchQuery, { isJSON: true })};
</script>
<script src="/bundle.js"></script>
</body>

</html>
`);
```

On the client, wrap your base `fetchQuery` function with `replayPayloads` and the recorded payloads from the above.

```js
import { replayPayloads } from 'relay-fetch';
import { Network } from 'relay-runtime';

const fetchQuery = replayPayloads(baseFetchQuery, window.__RELAY_PAYLOADS__);
const network = Network.create(fetchQuery);
```

[npm-badge]: https://img.shields.io/npm/v/relay-fetch.svg
[npm]: https://www.npmjs.org/package/relay-fetch
