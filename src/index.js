import('./utils.js').then(utils => {
  import(/* @vite-ignore */utils.coreVersion()).then(async (core) => {
    await import("./solid-ofn-rpp.js");
  });
});