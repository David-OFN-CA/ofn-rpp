import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import { importCore, CLIENT_CONTEXT } from '@helpers/utils';

importCore().then(core => {
  // Custom widget for wholesale
  customElements.define(
    "custom-redirector",
    class extends LitElement {
      constructor() {
        super();
      }

      static properties = {
        dataSrc: { attribute: "data-src" },
        uniq: { attribute: "uniq" },
      }

      _getResource = new Task(this, {
        task: async ([dataSrc]) => {
          if(!dataSrc) return;
          const resource = await core.store.getData(dataSrc, CLIENT_CONTEXT);
          let response = await (await resource["dfc-b:suppliedBy"])["@id"];
          return response;
        },
        args: () => [this.dataSrc]
      })

      firstUpdated() {
        document.addEventListener('navigate', (e) => {
          console.log(e);
          if(e.detail.route == `${this.uniq}-products-redirector` && e.explicitOriginalTarget == document.querySelector(`[default-route="${this.uniq}-producers-list"]`)) {
            window.dispatchEvent(
              new CustomEvent('requestNavigation', {
                detail: {
                  route: `${this.uniq}-products-list`
                }
              }),
            );
          }
        });
      }

      render() {
        if(!this.dataSrc || !this.uniq) return nothing;

        return this._getResource.render({
          pending: () => html`<div class="progress"><div class="indeterminate"></div></div>`,
          complete: (resource) => {
            if(resource) {
              window.dispatchEvent(
                new CustomEvent('requestNavigation', {
                  detail: {
                    resource: {"@id": resource},
                    route: `${this.uniq}-producer-details`
                  }
                }),
              );
            }
            return nothing;
          },
          error: (e) => html`<p>Error while loading redirector.</p>`
        });
      }
    }
  );
});
