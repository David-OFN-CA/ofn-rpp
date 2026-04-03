import { CLIENT_CONTEXT, makeExpand } from "@helpers/utils";

import * as core from "https://cdn.jsdelivr.net/npm/@startinblox/core@1/+esm";

(async () => {
  const expand = await makeExpand();
  core.Sib.register({
    name: "custom-multiple-badge-small",
    use: [core.StoreMixin],
    empty() {
      this.element.innerHTML = "";
    },
    async populate() {
      for (let chip of await expand(this.resource, "ldp:contains")) {
        chip = await window.sibStore.getData(chip["@id"], CLIENT_CONTEXT);
        let label = await expand(chip, "ofn:label");
        this.element.innerHTML += `
            <div class="chip small">${label}</div>
          `;
      }
    },
  });
})();
