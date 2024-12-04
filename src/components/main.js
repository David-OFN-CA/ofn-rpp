import { LitElement, html, nothing, unsafeCSS } from "lit";
import { Task } from "@lit/task";
import style from "@styles/index.scss?inline";
import "~icons/mdi/home-silo";
import "~icons/mdi/food-apple";
import "~icons/mdi/open-in-new";
import "~icons/mdi/facebook";
import "~icons/mdi/instagram";
import "~icons/mdi/linkedin";
import "~icons/mdi/whatsapp";
import "~icons/mdi/email-outline";
import * as utils from "@helpers/utils";

utils.importCore().then(async (core) => {
  const expand = await utils.makeExpand();
  customElements.define(
    "solid-ofn-rpp",
    class extends LitElement {
      constructor() {
        super();
        this.initMatomo();
      }

      static properties = {
        producersSrc: { attribute: "producers-src" },
        rangeProductCategories: { attribute: "range-product-categories" },
        rangeProducerAssurances: { attribute: "range-producer-assurances" },
        routePrefix: { attribute: "route-prefix" },
        uniq: { attribute: "uniq" },
      };

      createRenderRoot() {
        return this;
      }

      initMatomo() {
        if (!window._paq) {
          window._paq = [];
        }
        window._paq.push(["trackPageView"]);
        window._paq.push(["enableLinkTracking"]);
        window._paq.push(["trackVisibleContentImpressions", true, 750]);
        window._paq.push(["enableLinkTracking"]);
      }

      style() {
        return html`<style>
          ${unsafeCSS(style)}
        </style>`;
      }

      context() {
        return html`
          <script
            id="client-context"
            type="application/ld+json"
            data-default-context
          >
            ${JSON.stringify(utils.CLIENT_CONTEXT)}
          </script>
        `;
      }

      _preFetch = new Task(this, {
        task: async ([producersSrc, rangeProducerAssurances]) => {
          const assurancesSrc = await core.store.getData(
            rangeProducerAssurances,
            utils.CLIENT_CONTEXT
          );
          let assurances = [];
          for (let assurance of await expand(assurancesSrc, "ldp:contains")) {
            if (!assurance) {
              if (import.meta.env.DEV) {
                console.warn(
                  `Assurance ${assurance["@id"]} is an invalid resource`
                );
              }
              continue;
            }
            assurances.push(await assurance["ofn:Group_name"]);
          }

          const producers = await core.store.getData(
            producersSrc,
            utils.CLIENT_CONTEXT
          );

          let producerNames = [],
            addresses = [];

          if (!producers) {
            if (import.meta.env.DEV)
              console.warn(`Producer list ${p["@id"]} is an invalid container`);
            return;
          }

          for (let producer of await expand(producers, "ldp:contains")) {
            if (!producer) {
              if (import.meta.env.DEV) {
                console.warn(
                  `Producer ${producer["@id"]} is an invalid resource`
                );
              }
              continue;
            }
            producer = await core.store.getData(
              producer["@id"],
              utils.CLIENT_CONTEXT
            );
            let producerName = await expand(producer, "dfc-b:name");
            if (producerName) {
              producerNames.push(producerName);
            }
            let producerAddress = await expand(producer, "dfc-b:hasAddress");
            if (producerAddress) {
              let producerStreet = await expand(
                producerAddress,
                "dfc-b:hasStreet"
              );
              if (producerStreet) {
                addresses.push(producerStreet);
              }
              let producerPostalCode = await expand(
                producerAddress,
                "dfc-b:hasPostalCode"
              );
              if (producerPostalCode) {
                addresses.push(producerPostalCode);
              }
              let producerCity = await expand(producerAddress, "dfc-b:hasCity");
              if (producerCity) {
                addresses.push(producerCity);
              }
              let producerCountry = await expand(
                producerAddress,
                "dfc-b:hasCountry"
              );
              if (producerCountry) {
                addresses.push(producerCountry);
              }
            }
          }

          this.producerNames = Array.from(new Set(producerNames.sort())).reduce(
            (acc, value) => ({ ...acc, [value]: null }),
            {}
          );

          this.addresses = Array.from(new Set(addresses.sort())).reduce(
            (acc, value) => ({ ...acc, [value]: null }),
            {}
          );

          this.assurances = assurances;

          return producers;
        },
        args: () => [this.producersSrc, this.rangeProducerAssurances],
      });

      async updated() {
        if (!this.producersAdapted) {
          (async () => {
            for await (const select of core.Helpers.asyncQuerySelectorAll(
              `#producers-list-filters-${this.uniq} select`
            )) {
              if (!select.classList.contains("materialize")) {
                select.classList.add("browser-default");
              }
              M.FormSelect.init(select);
            }
          })();

          (async () => {
            for await (const filters of core.Helpers.asyncQuerySelectorAll(
              `#producers-list-filters-${this.uniq}`
            )) {
              filters.addEventListener("filterChange", (e) => {
                window._paq.push([
                  "trackSiteSearch",
                  e.detail,
                  "Producers list",
                  false,
                ]);
                window._mtm = window._mtm || [];
                if (e.detail.type === "select") {
                  window._mtm.push({
                    event: "Producer-Filter-Interaction",
                    "event-category": "Producer-Filter-Interaction",
                    "filter-name": e.detail.inputLabel,
                    "filter-value": e.detail.value,
                  });
                } else if (e.detail.type === "input") {
                  window._mtm.push({
                    event: "Producer-Filter",
                    "event-category": "Producer-Filter",
                    keyword: e.detail.value,
                  });
                }
              });
            }
          })();

          (async () => {
            M.Autocomplete.init(
              await core.Helpers.asyncQuerySelector(
                'input[type="text"][name="search-field"]'
              ),
              {
                data: this.producerNames,
                limit: 3,
                onAutocomplete: () => {
                  this.querySelector(
                    `[filtered-by=producers-list-filters-${this.uniq}]`
                  ).component.populate();
                },
              }
            );
          })();

          (async () => {
            M.Autocomplete.init(
              await core.Helpers.asyncQuerySelector(
                'input[type="text"][name="search-field-2"]'
              ),
              {
                data: this.addresses,
                limit: 3,
                onAutocomplete: () => {
                  this.querySelector(
                    `[filtered-by=producers-list-filters-${this.uniq}]`
                  ).component.populate();
                },
              }
            );
          })();

          this.producersAdapted = true;
        }
      }

      routers() {
        let render = html`
          <solid-router
            default-route="${this.route}-producers-list"
            route-prefix=${this.routePrefix ?? nothing}
          >
            <solid-route name="${this.route}-producers-list"></solid-route>
            <solid-route
              name="${this.route}-producer-details"
              use-id
            ></solid-route>
          </solid-router>
        `;
        return render;
      }

      firstUpdated() {
        let url = location.href;
        document.addEventListener("navigate", () => {
          if (url === location.href) return;
          url = location.href;
          window._paq.push(["setCustomUrl", url]);
          window._paq.push(["trackPageView"]);
          // setTimeout(
          //   () =>
          //     document.querySelector("body").scrollIntoView({
          //       behavior: "instant",
          //       block: "start",
          //       inline: "nearest",
          //     }),
          //   0
          // );
        });
      }

      _setAssuranceFilter(e) {
        const target = e.target?.closest("[value]");
        let seeAll = false;
        if (target) {
          const value = target.getAttribute("value");
          const solidFormDropdown = target
            .closest(`#${this.route}-producers-list`)
            .querySelector(
              '[name="ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner"] select'
            );
          if (target.classList.contains("active")) {
            solidFormDropdown.value = "";
            seeAll = true;
          } else {
            const option = Array.from(
              solidFormDropdown.querySelectorAll("option")
            ).find((o) => o.textContent.includes(value));
            if (option) {
              solidFormDropdown.value = option.value;
            }
          }
          solidFormDropdown
            .closest("solid-form-search")
            ._component.inputChange(solidFormDropdown);
          target.setAttribute("current", true);
          Array.from(
            target.parentElement.querySelectorAll("[value]:not([current])")
          ).map((el) => el.classList.remove("active"));
          if(value !== "") {
            target.classList.toggle("active");
          } else {
            target.classList.toggle("active", true);
          }
          target.removeAttribute("current");
          if(seeAll) {
            document.querySelector("#see-all")?.classList.toggle("active", true);
          }
        }
      }

      viewProducersList() {
        let render = html`
          <div
            id="${this.route}-producers-list"
            data-view="${this.route}-producers-list"
            no-render=""
            class="row producers-list"
          >
            <div class="col s12">
              <div class="row no-margin-bottom">
                <div class="col s12 m4"></div>
                <div class="col s12 m7">
                  <div class="padding-15 sm-padding-none">
                    ${this.assurances.map(
                      (assurance) => html`
                        <div
                          @click=${this._setAssuranceFilter}
                          value="${assurance}"
                          class="chip chip-filter"
                        >
                          ${assurance}
                        </div>
                      `
                    )}
                    <div
                      @click=${this._setAssuranceFilter}
                      value=""
                      class="chip chip-filter active"
                      id="see-all"
                    >
                      See all
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col s12 m4">
              <div class="row">
                <div class="col s12 m9 offset-m2">
                  <solid-form-search
                    id="producers-list-filters-${this.uniq}"
                    debounce="300"
                    loader-id="loader-producers-list-filters-${this.uniq}"
                    fields="set-line-field(set-line-field-col(set-line-field-panel(search-field))),set-line-field-2(set-line-field-col-2(set-line-field-panel-2(search-field-2))),filterBy-row(filterBy),set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(ofn:First_Nations_led)))),set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:hasProduceCategory)))),ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner"
                    class-set-line-field="row"
                    search-search-field="dfc-b:name, ofn:long_description"
                    widget-search-field="solid-form-label-text"
                    class-search-field="input-field col s12"
                    label-search-field="search by name"
                    class-set-line-field-2="row"
                    search-search-field-2="dfc-b:hasAddress.dfc-b:hasStreet, dfc-b:hasAddress.dfc-b:hasPostalCode, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry"
                    widget-search-field-2="solid-form-label-text"
                    class-search-field-2="input-field col s12"
                    label-search-field-2="search by location"
                    class-filterBy-row="row"
                    widget-filterBy-row="div"
                    class-filterBy="col s12 filterby"
                    widget-filterBy="div"
                    value-filterBy="Filter by"
                    widget-set-line-fnc="div"
                    class-set-line-fnc="row no-margin-bottom"
                    widget-set-line-fnc-col="div"
                    class-set-line-fnc-col="col s12"
                    widget-set-line-fnc-panel="div"
                    class-set-line-fnc-panel="filter card horizontal"
                    widget-set-line-fnc-wrapper="div"
                    class-set-line-fnc-wrapper="card-content"
                    value-ofn:First_Nations_led="${this.uniq}"
                    widget-ofn:First_Nations_led="custom-search-firstnationsled"
                    class-ofn:First_Nations_led="input-field col s12 no-margin no-padding"
                    widget-set-line-produce="div"
                    class-set-line-produce="row no-margin-bottom"
                    widget-set-line-produce-col="div"
                    class-set-line-produce-col="col s12"
                    widget-set-line-produce-panel="div"
                    class-set-line-produce-panel="filter card horizontal"
                    widget-set-line-produce-wrapper="div"
                    class-set-line-produce-wrapper="card-content select-padding"
                    class-ofn:hasProduceCategory="col s12"
                    label-ofn:hasProduceCategory="Category"
                    range-ofn:hasProduceCategory="${this
                      .rangeProductCategories}"
                    widget-ofn:hasProduceCategory="solid-form-dropdown-placeholder"
                    option-label-ofn:hasProduceCategory="ofn:label"
                    class-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="hidden"
                    range-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="${this
                      .rangeProducerAssurances}"
                    widget-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="solid-form-dropdown"
                    option-label-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="ofn:Group_name"
                  ></solid-form-search>
                </div>
              </div>
            </div>
            <div class="col s12 m7">
              <div class="loader" id="loader-producers-list-${this.uniq}">
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              </div>
              <solid-display
                loader-id="loader-producers-list-${this.uniq}"
                data-src="${this.producersSrc}"
                filtered-by="producers-list-filters-${this.uniq}"
                fields="set-card-row(set-card-col(set-card-panel(set-card-wrapper(set-left-panel(ofn:logo_url), set-right-panel(set-title(dfc-b:name, dfc-b:hasAddress.dfc-b:hasCity), set-description(dfc-b:hasDescription), set-tags(ofn:First_Nations_led, ofn:hasProduceCategory))))))"
                widget-set-card-row="div"
                class-set-card-row="row"
                widget-set-card-col="div"
                class-set-card-col="col s12"
                widget-set-card-panel="div"
                class-set-card-panel="card-panel"
                widget-set-card-wrapper="div"
                class-set-card-wrapper="row no-margin-bottom valign-wrapper"
                widget-set-left-panel="div"
                class-set-left-panel="col m2 center img-on-mobile"
                class-ofn:logo_url="responsive-img"
                widget-ofn:logo_url="solid-display-img"
                default-ofn:logo_url="https://placehold.co/120"
                widget-set-right-panel="div"
                class-set-right-panel="col s12 m10"
                widget-set-title="div"
                class-set-title="row valign-wrapper"
                widget-dfc-b:name="solid-display-value"
                class-dfc-b:name="col dfc_b_name"
                widget-dfc-b:hasAddress.dfc-b:hasCity="solid-display-value"
                class-dfc-b:hasAddress.dfc-b:hasCity="col dfc_b_address"
                widget-set-description="div"
                class-set-description="row"
                widget-dfc-b:hasDescription="custom-safe-html-value-short"
                class-dfc-b:hasDescription="col s12"
                widget-set-tags="div"
                widget-ofn:First_Nations_led="custom-badge-firstnationsled"
                widget-ofn:hasProduceCategory="custom-multiple-badge"
                next="${this.route}-producer-details"
                order-asc="dfc-b:name"
              ></solid-display>
            </div>
          </div>
        `;
        return render;
      }

      viewProducerDetails() {
        let render = html`
          <div
            id="${this.route}-producer-details"
            data-view="${this.route}-producer-details"
            no-render=""
            class="row producer-details"
          >
            <div class="col s12 m10 offset-m1">
              <div class="row">
                <div class="col s12">
                  <div class="row margin-top-20">
                    <div class="col s12 m4 margin-top-10">
                      <solid-display
                        bind-resources=""
                        fields="ofn:logo_url"
                        class-ofn:logo_url="img-120 img-logo"
                        widget-ofn:logo_url="solid-display-img"
                        default-ofn:logo_url="https://placehold.co/120"
                      ></solid-display>
                    </div>
                    <div class="col s12 m8 margin-top-10">
                      <div class="row margin-bottom-10 no-margin-left">
                        <solid-display
                          bind-resources=""
                          fields="wrapper(ofn:hasProduceCategory), dfc-b:name"
                          class-wrapper="valign-wrapper margin-bottom-10"
                          widget-wrapper="div"
                          widget-dfc-b:name="solid-display-value"
                          class-dfc-b:name="flow-text"
                          widget-ofn:hasProduceCategory="custom-multiple-badge-small"
                          class="col s12"
                        ></solid-display>
                      </div>
                      <div class="row">
                        <solid-display
                          bind-resources=""
                          fields="dfc-b:hasDescription"
                          class-dfc-b:hasDescription="col s12 text-18"
                        ></solid-display>
                      </div>
                      <conditional-display
                        bind-resources=""
                        condition="ofn:promo_image_url"
                      >
                        <div class="row">
                          <solid-display
                            bind-resources=""
                            fields="ofn:promo_image_url"
                            widget-ofn:promo_image_url="solid-display-img"
                            class-ofn:promo_image_url="flex-img bg-img-container"
                            class="col hide-on-small-only m12 margin-top-10"
                          ></solid-display>
                        </div>
                      </conditional-display>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <div class="row">
                    <div class="col s12 m4 line-height-27">
                      <h5>Location</h5>
                      <div class="row">
                        <solid-display
                          bind-resources=""
                          nested-field="dfc-b:hasAddress"
                          fields="street(dfc-b:hasStreet), city(dfc-b:hasCity, comma, dfc-b:hasPostalCode, comma2, dfc-b:hasCountry)"
                          class-street="col s12 text-16 text-light"
                          value-comma=", "
                          value-comma2=", "
                          class-city="col s12 text-16 text-light"
                        ></solid-display>
                      </div>
                      <solid-display
                        bind-resources=""
                        fields="ofn:First_Nations_country"
                        widget-ofn:First_Nations_country="custom-display-firstnationsled"
                      ></solid-display>
                      <!-- Commented: No map link in resource? -->
                      <!-- <div class="row valign-wrapper">
                          <div class="col s12 text-link text-link-red">View map</div>
                        </div> -->
                      <h5 class="margin-top-50">Find us online</h5>
                      <div class="row margin-top-20">
                        <solid-display
                          class="col"
                          bind-resources=""
                          fields="dfc-b:websitePage"
                          widget-dfc-b:websitePage="custom-display-householdurl"
                        ></solid-display>
                      </div>
                      <div class="row margin-top-20 no-margin-bottom">
                        <solid-display
                          bind-resources=""
                          fields="dfc-b:hasSocialMedia"
                          widget-dfc-b:hasSocialMedia="custom-social-links"
                        ></solid-display>
                      </div>
                    </div>
                    <conditional-display
                      bind-resources=""
                      condition="ofn:long_description"
                    >
                      <div class="col s12 m8">
                        <div class="row">
                          <div class="col s12">
                            <solid-display
                              bind-resources=""
                              fields="ofn:long_description"
                              class-ofn:long_description="text-16 line-height-24"
                              widget-ofn:long_description="custom-safe-html-value"
                            ></solid-display>
                          </div>
                        </div>
                      </div>
                    </conditional-display>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <div class="row">
                    <div class="col s12 m4">
                      <custom-connect-side
                        bind-resources=""
                        uniq="${this.uniq}"
                      ></custom-connect-side>
                    </div>
                    <div class="col s12 m8">
                      <custom-connect
                        bind-resources=""
                        uniq="${this.uniq}"
                      ></custom-connect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        return render;
      }

      render() {
        if (!this.uniq) this.uniq = utils.uniq();
        this.route = this.uniq;
        return this._preFetch.render({
          pending: () =>
            html`${this.style()}
              <div class="row">
                <div class="col s12">
                  <div class="progress"><div class="indeterminate"></div></div>
                </div>
              </div>`,
          complete: (datas) => {
            if (!datas) {
              return nothing;
            }
            return html`
              ${this.context()} ${this.style()} ${this.routers()}
              ${this.viewProducersList()} ${this.viewProducerDetails()}
            `;
          },
        });
      }
    }
  );
});
