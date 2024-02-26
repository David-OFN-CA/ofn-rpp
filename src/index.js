import "materialize-css/dist/js/materialize.min.js";

import('./utils.js').then(utils => {
  import(/* @vite-ignore */utils.coreVersion()).then(async (core) => {
    await import("./components/safe-html-value.js");
    await import("./components/safe-html-value-short.js");
    await import("./components/multiple-badge-list.js");
    await import("./components/badge-firstnationsled.js");
    await import("./components/search-firstnationsled.js");
    await import("./components/multiple-badge.js");
    await import("./components/multiple-badge-small.js");
    await import("./components/social-links.js");
    await import("./components/partials/wholesale-buy.js");
    await import("./solid-ofn-rpp.js");
  });
});