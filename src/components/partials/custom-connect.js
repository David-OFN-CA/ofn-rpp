import { LitElement, html, nothing } from "lit";
import { Task } from "@lit/task";
import "~icons/mdi/phone-in-talk";
import "~icons/mdi/open-in-new";
import { importCore, CLIENT_CONTEXT, uniq } from "@helpers/utils";

importCore().then((core) => {
  // Custom widget for wholesale
  customElements.define(
    "custom-connect",
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
          // ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner
          let assurances = [];
          try {
            const hasAssurancePartnerships = await resource[
              "ofn:hasAssurancePartnerships.ldp:contains"
            ];
            if (hasAssurancePartnerships) {
              if (!Array.isArray(hasAssurancePartnerships)) {
                hasAssurancePartnerships = [hasAssurancePartnerships];
              }
              for (let assurance of hasAssurancePartnerships) {
                assurance = await assurance[
                  "ofn:Assurance_partner.ldp:contains"
                ];
                if (assurance) {
                  if (!Array.isArray(assurance)) {
                    assurance = [assurance];
                  }
                  for (let partner of assurance) {
                    assurances.push(await partner["ofn:Group_name"]);
                  }
                }
              }
            }
          } catch (e) {
            if (import.meta.env.DEV) console.error(e);
          }
          let response = {
            "ofn:Wholesale_buy_description": await resource[
              "ofn:Wholesale_buy_description"
            ],
            "dfc-b:email": await resource["dfc-b:email"],
            "ofn:Wholesale_URL_1": await resource["ofn:Wholesale_URL_1"],
            "ofn:Wholesale_URL_1_label": await resource[
              "ofn:Wholesale_URL_1_label"
            ],
            "ofn:Wholesale_URL_2": await resource["ofn:Wholesale_URL_2"],
            "ofn:Wholesale_URL_2_label": await resource[
              "ofn:Wholesale_URL_2_label"
            ],
            "ofn:Wholesale_URL_3": await resource["ofn:Wholesale_URL_3"],
            "ofn:Wholesale_URL_3_label": await resource[
              "ofn:Wholesale_URL_3_label"
            ],
            assurances: assurances,
          };
          return response;
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
            if(!resource) {
              return nothing;
            }
            this.rendering = [];

            this.rendering.push(html`<div
              class="row margin-top-10 no-margin-bottom padding-15"
            >
              <div class="valign-wrapper">
                ${resource.assurances.map(
                  (assurance) =>
                    html`<div class="chip small">${assurance}</div>`
                )}
              </div>
            </div>`);

            if (resource["ofn:Wholesale_buy_description"]) {
              this.rendering.push(html`
                <div class="row">
                  <div class="col s12 text-16">
                    ${resource["ofn:Wholesale_buy_description"]}
                  </div>
                </div>
              `);
            }

            if (
              resource["ofn:Wholesale_URL_1"] &&
              resource["ofn:Wholesale_URL_1_label"]
            ) {
              this.rendering.push(html`
                <div class="row valign-wrapper no-margin-bottom">
                  <div class="col s12">
                    <a
                      href="${resource["ofn:Wholesale_URL_1"]}"
                      target="_blank"
                      class="text-link"
                      >${resource["ofn:Wholesale_URL_1_label"]}</a
                    >
                  </div>
                </div>
              `);
            }
            if (
              resource["ofn:Wholesale_URL_2"] &&
              resource["ofn:Wholesale_URL_2_label"]
            ) {
              this.rendering.push(html`
                <div class="row valign-wrapper no-margin-bottom">
                  <div class="col s12">
                    <a
                      href="${resource["ofn:Wholesale_URL_2"]}"
                      target="_blank"
                      class="text-link"
                      >${resource["ofn:Wholesale_URL_2_label"]}</a
                    >
                  </div>
                </div>
              `);
            }
            if (
              resource["ofn:Wholesale_URL_3"] &&
              resource["ofn:Wholesale_URL_3_label"]
            ) {
              this.rendering.push(html`
                <div class="row valign-wrapper no-margin-bottom">
                  <div class="col s12">
                    <a
                      href="${resource["ofn:Wholesale_URL_3"]}"
                      target="_blank"
                      class="text-link"
                      >${resource["ofn:Wholesale_URL_3_label"]}</a
                    >
                  </div>
                </div>
              `);
            }

            return this.rendering;
          },
          error: (e) =>
            html`<p>Error while loading wholesale informations.</p>`,
        });
      }
    }
  );
});
