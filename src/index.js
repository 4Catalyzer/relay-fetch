export function recordPayloads(baseFetchQuery) {
  const payloads = [];

  function fetchQuery(...args) {
    const i = payloads.length;
    payloads.push(null);

    return Promise.resolve(baseFetchQuery(...args)).then(payload => {
      payloads[i] = payload;
      return payload;
    });
  }

  fetchQuery.toJSON = () => payloads;
  return fetchQuery;
}

export function replayPayloads(baseFetchQuery, payloads) {
  return function fetchQuery(...args) {
    if (payloads.length) {
      return payloads.shift();
    }

    return baseFetchQuery(...args);
  };
}
