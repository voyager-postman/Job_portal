let loadingCallbacks = {
  start: () => {},
  stop: () => {},
};

export const bindFetchLoaderCallbacks = (start, stop) => {
  loadingCallbacks = {
    start: typeof start === "function" ? start : () => {},
    stop: typeof stop === "function" ? stop : () => {},
  };
};

export const fetchWithLoader = async (input, init = {}, { skipLoader = false } = {}) => {
  if (!skipLoader) {
    loadingCallbacks.start();
  }

  try {
    return await fetch(input, init);
  } finally {
    if (!skipLoader) {
      loadingCallbacks.stop();
    }
  }
};
