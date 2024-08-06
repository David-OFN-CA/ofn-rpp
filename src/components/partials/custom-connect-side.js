import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import "~icons/mdi/phone-in-talk";
import "~icons/mdi/open-in-new";
import { importCore, CLIENT_CONTEXT, uniq } from "@helpers/utils";

importCore().then((core) => {
  // Custom widget for connect
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
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = {
            "dfc-b:hasPhoneNumber": await resource["dfc-b:hasPhoneNumber"],
            "dfc-b:email": await resource["dfc-b:email"],
          };
          return response;
        },
        args: () => [this.dataSrc],
      });

      /**
       * Helper function that adds the given template to the current rendering.
       *
       * @param {html} template - the template to be added to the rendering
       */
      _addToRender(template) {
        if (!this.rendering) this.rendering = html``;
        this.rendering = html`${this.rendering}${template}`;
      }

      /**
       * Helper function that return the whole state of the rendering
       *
       * @return {html} Provide the current template
       */
      _render() {
        return this.rendering;
      }

      render() {
        if (!this.dataSrc) return nothing;
        if (!this.uniq) this.uniq = uniq();

        return this._getResource.render({
          pending: () =>
            html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            this.rendering = html`<h5 class="margin-bottom-20">Connect</h5>`;

            if (
              resource["dfc-b:hasPhoneNumber"]
            ) {
              this._addToRender(html`
                <div class="row text-link cursor-default valign-wrapper no-margin-bottom">
                  <div class="col s12 truncate">
                    <icon-mdi-phone-in-talk></icon-mdi-phone-in-talk>&nbsp;<a
                      class="text-link text-link-normal"
                      href="tel:${resource["dfc-b:hasPhoneNumber"]}"
                      target="_blank"
                      >${resource["dfc-b:hasPhoneNumber"]}</a
                    >
                  </div>
                </div>
              `);
            }
            if (
              resource["dfc-b:email"]
            ) {
              this._addToRender(html`
                <div class="row text-link cursor-default valign-wrapper no-margin-bottom">
                  <div class="col s12 truncate">
                    <icon-mdi-email-outline></icon-mdi-email-outline>&nbsp;<a
                      class="text-link text-link-normal"
                      href="mailto:${resource["dfc-b:email"]}"
                      target="_blank"
                      >${resource["dfc-b:email"]}</a
                    >
                  </div>
                </div>
              `);
            }

            return this._render();
          },
          error: (e) =>
            html`<p>Error while loading connect informations.</p>`,
        });
      }
    }
  );
});
