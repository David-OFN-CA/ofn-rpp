import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import "~icons/mdi/phone-in-talk";
import "~icons/mdi/open-in-new";
import { CLIENT_CONTEXT, uniq } from "@helpers/utils";

customElements.define(
  "custom-connect-side",
  class extends LitElement {
    static properties = {
      dataSrc: { attribute: "data-src" },
      uniq: { attribute: "uniq" },
    };

    createRenderRoot() {
      return this;
    }

    _getResource = new Task(this, {
      task: async ([dataSrc]) => {
        if (!dataSrc) return;
        try {
          const resource = await window.sibStore.getData(
            dataSrc,
            CLIENT_CONTEXT,
          );
          return {
            "dfc-b:hasPhoneNumber": await (
              await resource["dfc-b:hasPhoneNumber"]
            )["dfc-b:phoneNumber"],
            "dfc-b:email": await resource["dfc-b:email"],
          };
        } catch {
          return {};
        }
      },
      args: () => [this.dataSrc],
    });

    render() {
      if (!this.dataSrc) return nothing;
      if (!this.uniq) this.uniq = uniq();

      return this._getResource.render({
        pending: () =>
          html`<div class="progress"><div class="indeterminate"></div></div>`,
        complete: (resource) => {
          if (!resource) return nothing;

          return html`<h5 class="margin-bottom-20">Connect</h5>
            ${resource["dfc-b:hasPhoneNumber"]
              ? html`<div
                  class="row text-link cursor-default valign-wrapper no-margin-bottom"
                >
                  <div class="col s12 truncate">
                    <icon-mdi-phone-in-talk></icon-mdi-phone-in-talk>&nbsp;<a
                      class="text-link text-link-normal"
                      href="tel:${resource["dfc-b:hasPhoneNumber"]}"
                      target="_blank"
                      >${resource["dfc-b:hasPhoneNumber"]}</a
                    >
                  </div>
                </div>`
              : nothing}
            ${resource["dfc-b:email"]
              ? html`<div
                  class="row text-link cursor-default valign-wrapper no-margin-bottom"
                >
                  <div class="col s12 truncate">
                    <icon-mdi-email-outline></icon-mdi-email-outline>&nbsp;<a
                      class="text-link text-link-normal"
                      href="mailto:${resource["dfc-b:email"]}"
                      target="_blank"
                      >${resource["dfc-b:email"]}</a
                    >
                  </div>
                </div>`
              : nothing}`;
        },
        error: (e) => html`<p>Error while loading connect informations.</p>`,
      });
    }
  },
);
