import makeExpand from '@helpers/expand.js';

import("@helpers/utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    const expand = makeExpand(core, utils);
    // Custom widget for social media links
    core.Sib.register({
      name: "custom-social-links",
      use: [core.StoreMixin],
      empty() {
        this.element.innerHTML = "";
      },
      async populate() {
        this.element.innerHTML += `
          <div class="row">`;
        for (let social of await expand(this.resource, "ldp:contains")) {
          social = await core.store.getData(
            social["@id"],
            utils.CLIENT_CONTEXT
          );
          let app = (await expand(social, "dfc-b:name")).replace("_phone", "");
          let link = await expand(social, "dfc-b:URL");
          if (!/^https?:\/\//i.test(link)) {
            link = "https://" + link;
          }
          this.element.innerHTML += `
            <div class="col"><a class="social-link" href="${link}" target="_blank"><icon-mdi-${app} class="icon"></icon-mdi-${app}></a></div>
          `;
        }
        this.element.innerHTML += `
          </div>`;
      },
    });
  });
});
