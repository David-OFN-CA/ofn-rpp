import { LitElement, html, unsafeCSS } from "lit";
import makeExpand from '@helpers/expand.js';
import style from "@styles/index.scss?inline";
import "~icons/mdi/home-silo";
import "~icons/mdi/food-apple";
import "~icons/mdi/open-in-new";
import "~icons/mdi/facebook";
import "~icons/mdi/instagram";
import "~icons/mdi/linkedin";
import "~icons/mdi/whatsapp";
import "~icons/mdi/email-outline";

import("@helpers/utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    const expand = makeExpand(core, utils);

    customElements.define(
      "solid-ofn-rpp",
      class extends LitElement {
        constructor() {
          super();
        }

        static properties = {
          producersSrc: { attribute: "producers-src" },
          productsSrc: { attribute: "products-src" },
          rangeProductCategories: { attribute: "range-product-categories" },
          rangeProducerAssurances: { attribute: "range-producer-assurances" },
          uniq: { attribute: "uniq" },
        };

        createRenderRoot() {
          return this;
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

        routers() {
          let render = html`
            <solid-router default-route="${this.route}-producers-list">
              <solid-route name="${this.route}-producers-list"></solid-route>
              <solid-route name="${this.route}-products-list"></solid-route>
              <solid-route
                name="${this.route}-producer-details"
                use-id
              ></solid-route>
            </solid-router>
          `;
          return render;
        }

        viewWidgets() {
          let render = html``;
          return render;
        }

        viewProducersList() {
          setTimeout(() => {
            const producers = core.store.getData(
              this.producersSrc,
              utils.CLIENT_CONTEXT
            );
            let producerNames = [],
                addresses = [];
            producers.then(async (p) => {
              for (let producer of await expand(p, "ldp:contains")) {
                producer = await core.store.getData(
                  producer["@id"],
                  utils.CLIENT_CONTEXT
                );
                let producerName = await expand(producer, "dfc-b:name");
                if (producerName) {
                  producerNames.push(producerName);
                }
                let producerAddress = await expand(
                  producer,
                  "dfc-b:hasAddress"
                );
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

              producerNames = Array.from(new Set(producerNames.sort())).reduce(
                (acc, value) => ({ ...acc, [value]: null }),
                {}
              );

              addresses = Array.from(new Set(addresses.sort())).reduce(
                (acc, value) => ({ ...acc, [value]: null }),
                {}
              );

              Array.from(document.querySelectorAll("select")).map((select) =>
                select.classList.add("browser-default")
              );

              setTimeout(() => {
                M.Autocomplete.init(
                  document.querySelectorAll(
                    'input[type="text"][name="search-field"]'
                  ),
                  {
                    data: producerNames,
                    limit: 3,
                    onAutocomplete: () => {
                      document
                        .querySelector(
                          `[filtered-by=producers-list-filters-${this.uniq}]`
                        )
                        .component.populate();
                    },
                  }
                );
                M.Autocomplete.init(
                  document.querySelectorAll(
                    'input[type="text"][name="address"]'
                  ),
                  {
                    data: addresses,
                    limit: 3,
                    onAutocomplete: () => {
                      document
                        .querySelector(
                          `[filtered-by=producers-list-filters-${this.uniq}]`
                        )
                        .component.populate();
                    },
                  }
                );
                M.FormSelect.init(document.querySelectorAll("select"));
              }, 0);
            });
          }, 0);

          let render = html`
            <div
              id="${this.route}-producers-list"
              data-view="${this.route}-producers-list"
              class="row producers-list"
            >
              <div class="col s12 m4">
                <div class="row">
                  <div class="col s12 m9 offset-m2">
                    <!--<div class="loader" id="loader-producers-list-filters-${this
                      .uniq}">
                      <div class="progress">
                        <div class="indeterminate"></div>
                      </div>
                    </div>-->
                    <solid-form-search
                      id="producers-list-filters-${this.uniq}"
                      loader-id="loader-producers-list-filters-${this.uniq}"
                      fields="set-line-field(set-line-field-col(set-line-field-panel(search-field))), filterBy-row(filterBy), set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(ofn:First_Nations_country)))), set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:hasProduceCategory)))), set-line-assurance(set-line-assurance-col(set-line-assurance-panel(set-line-assurance-wrapper(ofn:hasSupportingEvidence)))), set-line-address(set-line-address-col(set-line-address-panel(set-line-address-wrapper(address))))"
                      class-set-line-field="row"
                      search-search-field="dfc-b:name, ofn:long_description"
                      widget-search-field="solid-form-label-text"
                      class-search-field="input-field col s12"
                      label-search-field="search for producers"
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
                      value-ofn:first_nations_country="${this.uniq}"
                      widget-ofn:first_nations_country="custom-search-firstnationsled"
                      class-ofn:first_nations_country="input-field col s12"
                      widget-set-line-produce="div"
                      class-set-line-produce="row no-margin-bottom"
                      widget-set-line-produce-col="div"
                      class-set-line-produce-col="col s12"
                      widget-set-line-produce-panel="div"
                      class-set-line-produce-panel="filter card horizontal"
                      widget-set-line-produce-wrapper="div"
                      class-set-line-produce-wrapper="card-content select-padding"
                      class-ofn:hasProduceCategory="col s12"
                      label-ofn:hasProduceCategory="Produce types"
                      range-ofn:hasProduceCategory="${this.rangeProductCategories}"
                      widget-ofn:hasProduceCategory="solid-form-dropdown-placeholder"
                      option-label-ofn:hasProduceCategory="ofn:label"
                      widget-set-line-assurance="div"
                      class-set-line-assurance="row no-margin-bottom"
                      widget-set-line-assurance-col="div"
                      class-set-line-assurance-col="col s12"
                      widget-set-line-assurance-panel="div"
                      class-set-line-assurance-panel="filter card horizontal"
                      widget-set-line-assurance-wrapper="div"
                      class-set-line-assurance-wrapper="card-content select-padding"
                      class-ofn:hasSupportingEvidence="col s12"
                      label-ofn:hasSupportingEvidence="Supporting Evidence"
                      range-ofn:hasSupportingEvidence="${this.rangeProducerAssurances}"
                      widget-ofn:hasSupportingEvidence="solid-form-dropdown-placeholder"
                      option-label-ofn:hasSupportingEvidence="ofn:Group_name"
                      widget-set-line-address="div"
                      class-set-line-address="row no-margin-bottom"
                      widget-set-line-address-col="div"
                      class-set-line-address-col="col s12"
                      widget-set-line-address-panel="div"
                      class-set-line-address-panel="filter card horizontal"
                      widget-set-line-address-wrapper="div"
                      class-set-line-address-wrapper="card-content"
                      search-address="dfc-b:hasAddress.dfc-b:hasStreet, dfc-b:hasAddress.dfc-b:hasPostalCode, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry"
                      widget-address="solid-form-label-text"
                      class-address="input-field col s12"
                      label-address="Location"
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
                  fields="set-card-row(set-card-col(set-card-panel(set-card-wrapper(set-left-panel(ofn:logo_url), set-right-panel(set-title(dfc-b:name, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry), set-description(ofn:long_description), set-tags(ofn:First_Nations_country, ofn:hasProduceCategory))))))"
                  widget-set-card-row="div"
                  class-set-card-row="row"
                  widget-set-card-col="div"
                  class-set-card-col="col s12"
                  widget-set-card-panel="div"
                  class-set-card-panel="card-panel"
                  widget-set-card-wrapper="div"
                  class-set-card-wrapper="row no-margin-bottom valign-wrapper"
                  widget-set-left-panel="div"
                  class-set-left-panel="col hide-on-small-only m2 center img-on-mobile"
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
                  widget-dfc-b:hasAddress.dfc-b:hasCountry="solid-display-value"
                  class-dfc-b:hasAddress.dfc-b:hasCountry="col dfc_b_address"
                  widget-set-description="div"
                  class-set-description="row"
                  widget-ofn:long_description="custom-safe-html-value-short"
                  class-ofn:long_description="col s12"
                  widget-set-tags="div"
                  widget-ofn:first_nations_country="custom-badge-firstnationsled"
                  widget-ofn:hasProduceCategory="custom-multiple-badge"
                  next="${this.route}-producer-details"
                ></solid-display>
              </div>
            </div>
          `;
          return render;
        }

        viewProductsList() {
          setTimeout(async () => {
            const products = core.store.getData(
              this.productsSrc,
              utils.CLIENT_CONTEXT
            );
            let productNames = [],
              productCategories = [];
            products.then(async (p) => {
              for (let product of await expand(p, "ldp:contains")) {
                product = await core.store.getData(
                  product["@id"],
                  utils.CLIENT_CONTEXT
                );
                let productName = await expand(product, "dfc-b:name");
                if (productName) {
                  productNames.push(productName);
                }
                let productCategory = await expand(product, "ofn:Type");
                if (productCategory) {
                  productCategories.push(productCategory);
                }
              }

              productNames = Array.from(new Set(productNames.sort())).reduce(
                (acc, value) => ({ ...acc, [value]: null }),
                {}
              );
              productCategories = Array.from(
                new Set(productCategories.sort())
              ).join(", ");
              // NOTICE: change to mutation observer
              document
                .querySelector(`#products-list-filters-${this.uniq}`)
                .setAttribute("enum-ofn:Type", productCategories);
              document
                .querySelector(
                  'solid-form-dropdown-placeholder[name="ofn:Type"]'
                )
                .setAttribute("enum", productCategories);

              Array.from(document.querySelectorAll("select")).map((select) =>
                select.classList.add("browser-default")
              );

              setTimeout(() => {
                M.Autocomplete.init(
                  document.querySelectorAll(
                    'input[type="text"][name="search-field-product"]'
                  ),
                  {
                    data: productNames,
                    limit: 3,
                    onAutocomplete: () => {
                      document
                        .querySelector(
                          `[filtered-by=products-list-filters-${this.uniq}]`
                        )
                        .component.populate();
                    },
                  }
                );
                M.FormSelect.init(document.querySelectorAll("select"));
              }, 0);
            });
          }, 0);
          let render = html`
            <div
              id="${this.route}-products-list"
              data-view="${this.route}-products-list"
              class="row products-list"
            >
              <div class="col s12 m4">
                <div class="row">
                  <div class="col s12 m9 offset-m2">
                    <!--<div class="loader" id="loader-products-list-filters-${this
                      .uniq}">
                      <div class="progress">
                        <div class="indeterminate"></div>
                      </div>
                    </div>-->
                    <solid-form-search
                      id="products-list-filters-${this.uniq}"
                      loader-id="loader-products-list-filters-${this.uniq}"
                      fields="set-line-field(set-line-field-col(set-line-field-panel(search-field-product))), filterBy-row(filterBy), set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(dfc-b:suppliedBy.ofn:First_Nations_country)))), set-line-ecological(set-line-ecological-col(set-line-ecological-panel(set-line-ecological-wrapper(dfc-b:suppliedBy.ofn:hasSupportingEvidence)))), set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:Type))))"
                      class-set-line-field="row"
                      search-search-field-product="dfc-b:name, ofn:description"
                      widget-search-field-product="solid-form-label-text"
                      class-search-field-product="input-field col s12"
                      label-search-field-product="search for products"
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
                      value-dfc-b:suppliedBy.ofn:first_nations_country="${this.uniq}"
                      widget-dfc-b:suppliedBy.ofn:first_nations_country="custom-search-firstnationsled"
                      class-dfc-b:suppliedBy.ofn:first_nations_country="input-field col s12"
                      widget-set-line-ecological="div"
                      class-set-line-ecological="row no-margin-bottom"
                      widget-set-line-ecological-col="div"
                      class-set-line-ecological-col="col s12"
                      widget-set-line-ecological-panel="div"
                      class-set-line-ecological-panel="filter card horizontal"
                      widget-set-line-ecological-wrapper="div"
                      class-set-line-ecological-wrapper="card-content select-padding"
                      widget-dfc-b:suppliedBy.ofn:hasSupportingEvidence="solid-form-dropdown-placeholder"
                      class-dfc-b:suppliedBy.ofn:hasSupportingEvidence="col s12"
                      label-dfc-b:suppliedBy.ofn:hasSupportingEvidence="Supporting Evidence"
                      range-dfc-b:suppliedBy.ofn:hasSupportingEvidence="${this.rangeProducerAssurances}"
                      option-label-ofn:hasSupportingEvidence="ofn:Group_name"
                      widget-set-line-produce="div"
                      class-set-line-produce="row no-margin-bottom"
                      widget-set-line-produce-col="div"
                      class-set-line-produce-col="col s12"
                      widget-set-line-produce-panel="div"
                      class-set-line-produce-panel="filter card horizontal"
                      widget-set-line-produce-wrapper="div"
                      class-set-line-produce-wrapper="card-content select-padding"
                      enum-ofn:Type=""
                      widget-ofn:Type="solid-form-dropdown-placeholder"
                      class-ofn:Type="col s12"
                      label-ofn:Type="Produce types"
                    ></solid-form-search>
                  </div>
                </div>
              </div>
              <div class="col s12 m8">
                <div class="loader" id="loader-products-list-${this.uniq}">
                  <div class="progress">
                    <div class="indeterminate"></div>
                  </div>
                </div>
                <solid-display
                  class="row card-container"
                  loader-id="loader-products-list-${this.uniq}"
                  data-src="${this.productsSrc}"
                  filtered-by="products-list-filters-${this.uniq}"
                  fields="set-card-col(set-card-panel(set-card-wrapper(set-image(ofn:image), set-name(dfc-b:name), set-from(dfc-b:suppliedBy.dfc-b:name))))"
                  widget-set-card-row="div"
                  class-set-card-row="row"
                  widget-set-card-col="div"
                  class-set-card-col="col s6 m3"
                  widget-set-card-panel="div"
                  class-set-card-panel="card-panel"
                  widget-set-card-wrapper="div"
                  class-ofn:image="img-168"
                  widget-ofn:image="solid-display-img"
                  default-ofn:image="https://placehold.co/168"
                  widget-set-name="div"
                  class-set-name="row no-margin-bottom"
                  widget-dfc-b:name="solid-display-value"
                  class-dfc-b:name="col s12 truncate"
                  widget-set-from="div"
                  class-set-from="row no-margin-bottom"
                  widget-dfc-b:suppliedBy.dfc-b:name="solid-display-value"
                  class-dfc-b:suppliedBy.dfc-b:name="col s12 truncate"
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
              class="row producer-details"
            >
              <div class="col s10 offset-s1">
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round">
                      <div class="row valign-wrapper title-header no-margin-bottom"></div>
                      <div class="row margin-top-20">
                        <div class="col s3 margin-top-10">
                          <solid-display
                            bind-resources=""
                            fields="ofn:logo_url"
                            class-ofn:logo_url="img-120 img-logo"
                            widget-ofn:logo_url="solid-display-img"
                            default-ofn:logo_url="https://placehold.co/120"
                          ></solid-display>
                        </div>
                        <div class="col s8 margin-top-10">
                          <div class="row no-margin-bottom">
                            <solid-display
                              bind-resources=""
                              fields="wrapper(dfc-b:name, ofn:hasProduceCategory)"
                              class-wrapper="valign-wrapper"
                              widget-wrapper="div"
                              widget-dfc-b:name="solid-display-value"
                              class-dfc-b:name="flow-text margin-right-10"
                              widget-ofn:hasProduceCategory="custom-multiple-badge-small"
                            ></solid-display>
                          </div>
                          <div class="row text-address">
                            <solid-display
                              bind-resources=""
                              fields="dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry"
                              widget-dfc-b:hasAddress.dfc-b:hasCity="solid-display-value"
                              class-dfc-b:hasAddress.dfc-b:hasCity="col dfc_b_address"
                              widget-dfc-b:hasAddress.dfc-b:hasCountry="solid-display-value"
                              class-dfc-b:hasAddress.dfc-b:hasCountry="col dfc_b_address"
                            ></solid-display>
                          </div>
                          <div class="row">
                            <solid-display
                              bind-resources=""
                              fields="dfc-b:hasDescription"
                              class-dfc-b:hasDescription="col s12 text-18"
                            ></solid-display>
                            <a
                              class="col s12 learn-more"
                              href="#${this.uniq}-about-us"
                              >Learn more about us</a
                            >
                          </div>
                          <hr />
                          <div class="row">
                            <div class="col s6">
                              <div class="row no-margin-bottom">
                                <div class="col s12">
                                  <span class="bold-16-21"
                                    >Assurance Partners</span
                                  >
                                </div>
                              </div>
                              <div class="row">
                                <div class="col s12">
                                  <a
                                    class="learn-more underline"
                                    href="#${this.uniq}-supporting-evidence"
                                    >Learn more</a
                                  >
                                </div>
                              </div>
                              <div class="row">
                                <div class="col s12">
                                  <solid-display
                                    bind-resources=""
                                    nested-field="ofn:hasSupportingEvidence"
                                    fields="ofn:promo_image_url, ofn:Title"
                                    widget-ofn:promo_image_url="solid-display-img"
                                    class-ofn:Title="text-14 text-green bold underline"
                                  ></solid-display>
                                </div>
                              </div>
                            </div>
                            <!-- <div class="col s6">
                              <div class="row">
                                <div class="col s12">
                                  <span class="bold-16-21"
                                    >Supporting Evidence</span
                                  >
                                </div>
                              </div>
                              <div class="row">
                                <div class="col s12">
                                  <a
                                    class="learn-more underline"
                                    href="#${this.uniq}-supporting-evidence"
                                    >Learn more</a
                                  >
                                </div>
                              </div>
                              <div class="row no-margin-bottom">
                                <div class="col s12">
                                  <div class="chip small text-12 peach">1</div>
                                  <span class="text-14 text-light">
                                    for
                                    <span class="underline"
                                      >ecological outcomes</span
                                    ></span
                                  >
                                </div>
                              </div>
                              <div class="row no-margin-bottom">
                                <div class="col s12">
                                  <div class="chip small text-12 peach">2</div>
                                  <span class="text-14 text-light">
                                    for
                                    <span class="underline"
                                      >practices</span
                                    ></span
                                  >
                                </div>
                              </div>
                              <div class="row no-margin-bottom">
                                <div class="col s12">
                                  <div class="chip small text-12 peach">1</div>
                                  <span class="text-14 text-light">
                                    for
                                    <span class="underline"
                                      >participation</span
                                    ></span
                                  >
                                </div>
                              </div>
                            </div> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-how-to-buy">How to buy</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round card-padding">
                      <div class="row">
                        <div class="col s3">
                          <custom-wholesale-buy bind-resources="" uniq="${this.uniq}"></custom-wholesale-buy>
                        </div>
                        <div class="col s8 offset-s1">
                          <h5>Feature products</h5>
                          <solid-display
                            bind-resources=""
                            nested-field="dfc-b:supplies"
                            fields="set-card-col(set-card-panel(set-card-wrapper(set-image(ofn:image), set-name(dfc-b:name))))"
                            widget-set-card-row="div"
                            class-set-card-row="row"
                            widget-set-card-col="div"
                            class-set-card-col="col s6 m4"
                            widget-set-card-panel="div"
                            class-set-card-panel="card-panel"
                            widget-set-card-wrapper="div"
                            class-ofn:image="img-200"
                            widget-ofn:image="solid-display-img"
                            default-ofn:image="https://placehold.co/200"
                            widget-set-name="div"
                            class-set-name="row no-margin-bottom"
                            widget-dfc-b:name="solid-display-value"
                            class-dfc-b:name="col s12 truncate"
                          ></solid-display>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-about-us">About us</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round card-padding">
                      <div class="row">
                        <div class="col s3">
                          <h5>Location</h5>
                          <div class="row">
                            <solid-display
                              bind-resources=""
                              nested-field="dfc-b:hasAddress"
                              fields="street(dfc-b:hasStreet), city(dfc-b:hasCity, dfc-b:hasPostalCode), country(dfc-b:hasCountry)"
                              class-street="col s12 text-16 text-light"
                              class-city="col s12 text-16 text-light"
                              class-country="col s12 text-16 text-light"
                            ></solid-display>
                          </div>
                          <div class="row">
                            <solid-display
                              bind-resources=""
                              fields="ofn:First_Nations_country"
                              widget-ofn:First_Nations_country="custom-display-firstnationsled"
                            ></solid-display>
                          </div>
                          <div class="row text-link valign-wrapper">
                            <div class="col s12">
                              View map&nbsp;<icon-mdi-open-in-new
                              ></icon-mdi-open-in-new>
                            </div>
                          </div>
                          <h5 class="margin-top-50">Useful links</h5>
                          <div class="row no-margin-bottom">
                            <div class="col s12">
                              <solid-display
                                bind-resources=""
                                fields="ofn:Household_URL"
                                link-text-ofn:Household_URL="Producer website"
                                class-ofn:Household_URL="text-link text-red"
                                widget-ofn:Household_URL="solid-display-link-blank"
                              ></solid-display>
                            </div>
                          </div>
                          <div class="row no-margin-bottom">
                            <solid-display
                              bind-resources=""
                              fields="dfc-b:hasSocialMedia"
                              widget-dfc-b:hasSocialMedia="custom-social-links"
                            ></solid-display>
                          </div>
                        </div>
                        <div class="col s9">
                          <div class="row">
                            <div
                              class="col hide-on-small-only m12 margin-top-10"
                            >
                              <img
                                class="responsive-img"
                                style="width: 100%"
                                src="/kialla_silos.png"
                              />
                            </div>
                          </div>
                          <div class="row">
                            <div class="col s12">
                              <solid-display
                                bind-resources=""
                                fields="ofn:long_description"
                                class-ofn:long_description="text-16"
                                widget-ofn:long_description="custom-safe-html-value"
                              ></solid-display>
                            </div>
                          </div>
                          <h5>Practices</h5>
                          <solid-display
                            bind-resources=""
                            fields="ofn:Practices"
                            widget-ofn:Practices="custom-multiple-badge-list"
                          ></solid-display>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-supporting-evidence">
                  Supporting evidence
                </h4>
                <div class="row">
                  <div class="col s12">
                    <div class="row">
                      <div class="col s3"></div>
                      <div class="col s8"></div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-contact-producer">Contact Producer</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="row">
                      <div class="col s3"></div>
                      <div class="col s8"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return render;
        }

        render() {
          if(!this.uniq) this.uniq = utils.uniq();
          this.route = this.uniq;
          return html`
            ${this.context()}
            ${this.style()}
            ${this.routers()}
            ${this.viewProductsList()}
            ${this.viewProducersList()}
            ${this.viewProducerDetails()}
          `;
        }
      }
    );
  });
});
