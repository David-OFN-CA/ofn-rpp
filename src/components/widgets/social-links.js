import { importCore, CLIENT_CONTEXT, expand } from '@helpers/utils';

const core = await importCore();

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
        CLIENT_CONTEXT
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
