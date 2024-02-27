import makeExpand from '@helpers/expand.js';

import("@helpers/utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    const expand = makeExpand(core, utils);

    core.Sib.register({
      name: "custom-multiple-badge-small",
      use: [core.StoreMixin],
      empty() {
        this.element.innerHTML = "";
      },
      async populate() {
        for (let chip of await expand(this.resource, "ldp:contains")) {
          chip = await core.store.getData(
            chip["@id"],
            utils.CLIENT_CONTEXT
          );
          let label = (await expand(chip, "ofn:label"));
          this.element.innerHTML += `
            <div class="chip small">${label}</div>
          `;
        }
      },
    });
  });
});
