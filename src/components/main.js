import { LitElement, html, nothing, unsafeCSS } from "lit";
import style from "@styles/index.scss?inline";
import "~icons/mdi/home-silo";
import "~icons/mdi/food-apple";
import "~icons/mdi/open-in-new";
import "~icons/mdi/facebook";
import "~icons/mdi/instagram";
import "~icons/mdi/linkedin";
import "~icons/mdi/whatsapp";
import "~icons/mdi/email-outline";
import * as utils from '@helpers/utils';

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
        productsSrc: { attribute: "products-src" },
        rangeProductCategories: { attribute: "range-product-categories" },
        rangeProducerAssurances: { attribute: "range-producer-assurances" },
        rangeProducerCertifications: { attribute: "range-producer-certifications" },
        rangeProducerOutcomes: { attribute: "range-producer-supporting-evidence" },
        routePrefix: { attribute: "route-prefix" },
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
          <solid-router default-route="${this.route}-producers-list" route-prefix=${this.routePrefix ?? nothing}>
            <solid-route name="${this.route}-producers-list"></solid-route>
            <solid-route name="${this.route}-products-list"></solid-route>
            <solid-route name="${this.route}-products-redirector" use-id></solid-route>
            <solid-route
              name="${this.route}-producer-details"
              use-id
            ></solid-route>
          </solid-router>
        `;
        return render;
      }

      initMatomo() {
        if(!window._paq) {
          window._paq = [];
        }
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        window._paq.push(['trackVisibleContentImpressions', true, 750]);
        window._paq.push(['enableLinkTracking']);
      }

      firstUpdated() {
        let url = location.href;    
        document.addEventListener('navigate', () => {
          if (url === location.href) return;
          url = location.href;
          window._paq.push(['setCustomUrl', url]);
          window._paq.push(['trackPageView']);
        });
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
                let producerRegion = await expand(
                  producerAddress,
                  "dfc-b:region"
                );
                if (producerRegion) {
                  addresses.push(producerRegion);
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

            Array.from(this.querySelectorAll("select")).map((select) => {
                if (!select.classList.contains("materialize")) {
                  select.classList.add("browser-default");
                }
              }
            );

            setTimeout(() => {
              M.Autocomplete.init(
                this.querySelectorAll(
                  'input[type="text"][name="search-field"]'
                ),
                {
                  data: producerNames,
                  limit: 3,
                  onAutocomplete: () => {
                    this
                      .querySelector(
                        `[filtered-by=producers-list-filters-${this.uniq}]`
                      )
                      .component.populate();
                  },
                }
              );
              M.Autocomplete.init(
                this.querySelectorAll(
                  'input[type="text"][name="address"]'
                ),
                {
                  data: addresses,
                  limit: 3,
                  onAutocomplete: () => {
                    this
                      .querySelector(
                        `[filtered-by=producers-list-filters-${this.uniq}]`
                      )
                      .component.populate();
                  },
                }
              );
              M.FormSelect.init(this.querySelectorAll("select"));
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
                    fields="set-line-field(set-line-field-col(set-line-field-panel(search-field))),filterBy-row(filterBy),set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(ofn:First_Nations_led)))),${this.rangeProducerOutcomes ? "set-line-ecological(set-line-ecological-col(set-line-ecological-panel(set-line-ecological-wrapper(ofn:hasSupportingEvidence.ldp:contains.ofn:Classification))))," : ""}set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:hasProduceCategory)))),${this.rangeProducerAssurances ? "set-line-assurance(set-line-assurance-col(set-line-assurance-panel(set-line-assurance-wrapper(ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner))))," : ""}${this.rangeProducerCertifications ? "set-line-certification(set-line-certification-col(set-line-certification-panel(set-line-certification-wrapper(ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus))))," : ""}set-line-address(set-line-address-col(set-line-address-panel(set-line-address-wrapper(address))))"
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
                    value-ofn:First_Nations_led="${this.uniq}"
                    widget-ofn:First_Nations_led="custom-search-firstnationsled"
                    class-ofn:First_Nations_led="input-field col s12 no-margin no-padding"
                    widget-set-line-ecological="div"
                    class-set-line-ecological="row no-margin-bottom"
                    widget-set-line-ecological-col="div"
                    class-set-line-ecological-col="col s12"
                    widget-set-line-ecological-panel="div"
                    class-set-line-ecological-panel="filter card horizontal"
                    widget-set-line-ecological-wrapper="div"
                    class-set-line-ecological-wrapper="card-content select-padding"
                    class-ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="col s12"
                    label-ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="Ecological Outcomes"
                    range-ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="${this.rangeProducerOutcomes}"
                    widget-ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="solid-form-dropdown-placeholder"
                    option-label-ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="ofn:label"
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
                    class-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="col s12"
                    label-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="Assurance Partners"
                    range-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="${this.rangeProducerAssurances}"
                    widget-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="solid-form-dropdown-placeholder"
                    option-label-ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="ofn:Group_name"
                    widget-set-line-certification="div"
                    class-set-line-certification="row no-margin-bottom"
                    widget-set-line-certification-col="div"
                    class-set-line-certification-col="col s12"
                    widget-set-line-certification-panel="div"
                    class-set-line-certification-panel="filter card horizontal"
                    widget-set-line-certification-wrapper="div"
                    class-set-line-certification-wrapper="card-content select-padding"
                    class-ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus="col s12"
                    label-ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus="Certifications"
                    range-ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus="${this.rangeProducerCertifications}"
                    widget-ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus="solid-form-dropdown-placeholder"
                    option-label-ofn:hasCertifications.ldp:contains.ofn:hasCertificationStatus="ofn:label"
                    widget-set-line-address="div"
                    class-set-line-address="row no-margin-bottom"
                    widget-set-line-address-col="div"
                    class-set-line-address-col="col s12"
                    widget-set-line-address-panel="div"
                    class-set-line-address-panel="filter card horizontal"
                    widget-set-line-address-wrapper="div"
                    class-set-line-address-wrapper="card-content"
                    search-address="dfc-b:hasAddress.dfc-b:hasStreet, dfc-b:hasAddress.dfc-b:hasPostalCode, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry, dfc-b:hasAddress.dfc-b:region"
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
                fields="set-card-row(set-card-col(set-card-panel(set-card-wrapper(set-left-panel(ofn:logo_url), set-right-panel(set-title(dfc-b:name, dfc-b:hasAddress.dfc-b:hasCity, region(dfc-b:hasAddress.dfc-b:region, comma, dfc-b:hasAddress.dfc-b:hasCountry)), set-description(ofn:long_description), set-tags(ofn:First_Nations_led, ofn:hasProduceCategory))))))"
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
                widget-dfc-b:hasAddress.dfc-b:region="solid-display-value"
                widget-dfc-b:hasAddress.dfc-b:hasCountry="solid-display-value"
                value-comma=", "
                class-region="col dfc_b_address"
                widget-set-description="div"
                class-set-description="row"
                widget-ofn:long_description="custom-safe-html-value-short"
                class-ofn:long_description="col s12"
                widget-set-tags="div"
                widget-ofn:First_Nations_led="custom-badge-firstnationsled"
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
            this
              .querySelector(`#products-list-filters-${this.uniq}`)
              .setAttribute("enum-ofn:Type", productCategories);
            this
              .querySelector(
                'solid-form-dropdown-placeholder[name="ofn:Type"]'
              )
              .setAttribute("enum", productCategories);

            Array.from(this.querySelectorAll("select")).map((select) => {
                if (!select.classList.contains("materialize")) {
                  select.classList.add("browser-default");
                }
              }
            );

            setTimeout(() => {
              M.Autocomplete.init(
                this.querySelectorAll(
                  'input[type="text"][name="search-field-product"]'
                ),
                {
                  data: productNames,
                  limit: 3,
                  onAutocomplete: () => {
                    this
                      .querySelector(
                        `[filtered-by=products-list-filters-${this.uniq}]`
                      )
                      .component.populate();
                  },
                }
              );
              M.FormSelect.init(this.querySelectorAll("select"));
            }, 0);
          });
        }, 0);
        let render = html`
          <div
            id="${this.route}-products-redirector"
            data-view="${this.route}-products-redirector"
          >
            <custom-redirector bind-resources="" uniq="${this.uniq}"></custom-redirector>
          </div>
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
                    fields="set-line-field(set-line-field-col(set-line-field-panel(search-field-product))),filterBy-row(filterBy),set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(dfc-b:suppliedBy.ofn:First_Nations_led)))),${this.rangeProducerOutcomes ? "set-line-ecological(set-line-ecological-col(set-line-ecological-panel(set-line-ecological-wrapper(dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification))))," : ""}set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:Type))))${this.rangeProducerAssurances ? ",set-line-assurance(set-line-assurance-col(set-line-assurance-panel(set-line-assurance-wrapper(dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner))))" : ""}"
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
                    value-dfc-b:suppliedBy.ofn:First_Nations_led="${this.uniq}"
                    widget-dfc-b:suppliedBy.ofn:First_Nations_led="custom-search-firstnationsled"
                    class-dfc-b:suppliedBy.ofn:First_Nations_led="input-field col s12 no-margin no-padding"
                    widget-set-line-ecological="div"
                    class-set-line-ecological="row no-margin-bottom"
                    widget-set-line-ecological-col="div"
                    class-set-line-ecological-col="col s12"
                    widget-set-line-ecological-panel="div"
                    class-set-line-ecological-panel="filter card horizontal"
                    widget-set-line-ecological-wrapper="div"
                    class-set-line-ecological-wrapper="card-content select-padding"
                    class-dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="col s12"
                    label-dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="Ecological Outcomes"
                    range-dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="${this.rangeProducerOutcomes}"
                    widget-dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="solid-form-dropdown-placeholder"
                    option-label-dfc-b:suppliedBy.ofn:hasSupportingEvidence.ldp:contains.ofn:Classification="ofn:label"
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
                    widget-set-line-assurance="div"
                    class-set-line-assurance="row no-margin-bottom"
                    widget-set-line-assurance-col="div"
                    class-set-line-assurance-col="col s12"
                    widget-set-line-assurance-panel="div"
                    class-set-line-assurance-panel="filter card horizontal"
                    widget-set-line-assurance-wrapper="div"
                    class-set-line-assurance-wrapper="card-content select-padding"
                    class-dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="col s12"
                    label-dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="Assurance Partners"
                    range-dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="${this.rangeProducerAssurances}"
                    widget-dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="solid-form-dropdown-placeholder"
                    option-label-dfc-b:suppliedBy.ofn:hasAssurancePartnerships.ldp:contains.ofn:Assurance_partner="ofn:Group_name"
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
                class-set-card-col="col s6 l4 xl3"
                widget-set-card-panel="div"
                class-set-card-panel="card-panel"
                widget-set-card-wrapper="div"
                class-ofn:image="img-168"
                widget-ofn:image="custom-display-image"
                default-ofn:image="https://placehold.co/168"
                widget-set-name="div"
                class-set-name="row no-margin-bottom"
                widget-dfc-b:name="solid-display-value"
                class-dfc-b:name="col s12 truncate"
                widget-set-from="div"
                class-set-from="row no-margin-bottom"
                widget-dfc-b:suppliedBy.dfc-b:name="solid-display-value"
                class-dfc-b:suppliedBy.dfc-b:name="col s12 truncate"
                next="${this.route}-products-redirector"
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
            <div class="col s12 m10 offset-m1">
              <div class="row">
                <div class="col s12">
                  <div class="card-panel card-round">
                    <div class="row valign-wrapper no-margin-bottom title-header" style="background: url(${utils.assetPath('/producer_background.png')})"></div>
                    <div class="row margin-top-20">
                      <div class="col s12 m3 margin-top-10">
                        <solid-display
                          bind-resources=""
                          fields="ofn:logo_url"
                          class-ofn:logo_url="img-120 img-logo"
                          widget-ofn:logo_url="solid-display-img"
                          default-ofn:logo_url="https://placehold.co/120"
                        ></solid-display>
                      </div>
                      <div class="col s12 m8 margin-top-10">
                        <div class="row no-margin-bottom no-margin-left">
                          <solid-display
                            bind-resources=""
                            fields="wrapper(ofn:hasProduceCategory), dfc-b:name"
                            class-wrapper="valign-wrapper"
                            widget-wrapper="div"
                            widget-dfc-b:name="solid-display-value"
                            class-dfc-b:name="flow-text"
                            widget-ofn:hasProduceCategory="custom-multiple-badge-small"
                            class="col s12"
                          ></solid-display>
                        </div>
                        <div class="row text-address">
                          <solid-display
                            bind-resources=""
                            fields="region(dfc-b:hasAddress.dfc-b:hasCity, comma, dfc-b:hasAddress.dfc-b:region), ofn:First_Nations_country"
                            widget-dfc-b:hasAddress.dfc-b:hasCity="solid-display-value"
                            widget-dfc-b:hasAddress.dfc-b:region="solid-display-value"
                            widget-ofn:First_Nations_country="solid-display-value"
                            value-comma=" - "
                            class-ofn:First_Nations_country="dfc_b_address"
                            class-region="dfc_b_address with-margin"
                            class="col s12"
                          ></solid-display>
                        </div>
                        <div class="row">
                          <solid-display
                            bind-resources=""
                            fields="dfc-b:hasDescription"
                            class-dfc-b:hasDescription="col s12 text-18"
                          ></solid-display>
                          <a
                            class="col s12 learn-more underline"
                            href="#${this.uniq}-about-us"
                            >Learn more about us</a
                          >
                        </div>
                        <conditional-display
                          bind-resources=""
                          condition="ofn:hasSupportingEvidence|ofn:hasAssurancePartnerships">
                          <hr style="margin-left: 0; margin-right: 0;" />
                          <div class="row">
                            <conditional-display
                              bind-resources=""
                              condition="ofn:hasAssurancePartnerships">
                              <div class="col s12 m6">
                                <div class="row no-margin-bottom">
                                  <div class="col s12">
                                    <span class="bold-16-21"
                                      >Assurance Partners</span
                                    >
                                  </div>
                                </div>
                                <conditional-display
                                  bind-resources=""
                                  condition="ofn:hasSupportingEvidence">
                                  <div class="row">
                                    <div class="col s12">
                                      <span class="learn-more underline" onclick="document.querySelector('custom-supporting-evidence').navigateToMe()">Learn more</span>
                                    </div>
                                  </div>
                                </conditional-display>
                                <div class="row">
                                  <div class="col s12">
                                    <solid-display
                                      bind-resources=""
                                      nested-field="ofn:hasAssurancePartnerships"
                                      fields="ofn:Assurance_partner"
                                      widget-ofn:Assurance_partner="custom-assurance-partner"
                                    ></solid-display>
                                  </div>
                                </div>
                              </div>
                            </conditional-display>
                            <conditional-display
                              bind-resources=""
                              condition="ofn:hasSupportingEvidence">
                              <div class="col s12 m6">
                                <div class="row no-margin-bottom">
                                  <div class="col s12">
                                    <span class="bold-16-21">Supporting Evidence</span>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <span class="learn-more underline" onclick="document.querySelector('custom-supporting-evidence').navigateToMe()">Learn more</span>
                                  </div>
                                </div>
                                <custom-supporting-evidence-counter bind-resources=""></custom-supporting-evidence-counter>
                              </conditional-display>
                            </div>
                          </div>
                        </conditional-display>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <conditional-display
                bind-resources=""
                condition="dfc-b:supplies">
                <h4 id="${this.uniq}-how-to-buy">How to buy</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round card-padding">
                      <div class="row">
                        <div class="col s12 m3">
                          <custom-wholesale-buy bind-resources="" uniq="${this.uniq}"></custom-wholesale-buy>
                        </div>
                        <div class="col s12 m8 offset-m1">
                          <h5>Feature products</h5>
                          <solid-display
                            bind-resources=""
                            nested-field="dfc-b:supplies"
                            fields="set-card-col(set-card-panel(set-card-wrapper(set-image(ofn:image), set-name(dfc-b:name))))"
                            widget-set-card-row="div"
                            class-set-card-row="row"
                            widget-set-card-col="div"
                            class-set-card-col="col s12 l6 xl4"
                            widget-set-card-panel="div"
                            class-set-card-panel="card-panel"
                            widget-set-card-wrapper="div"
                            class-ofn:image="img-200"
                            widget-ofn:image="custom-display-image"
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
              </conditional-display>
              <h4 id="${this.uniq}-about-us">About us</h4>
              <div class="row">
                <div class="col s12">
                  <div class="card-panel card-round card-padding">
                    <div class="row">
                      <div class="col s12 m3">
                        <h5>Location</h5>
                        <div class="row">
                          <solid-display
                            bind-resources=""
                            nested-field="dfc-b:hasAddress"
                            fields="street(dfc-b:hasStreet), city(dfc-b:hasCity, comma, dfc-b:hasPostalCode), region(dfc-b:region), country(dfc-b:hasCountry)"
                            class-street="col s12 text-16 text-light"
                            value-comma=", "
                            class-city="col s12 text-16 text-light"
                            class-region="col s12 text-16 text-light"
                            class-country="col s12 text-16 text-light"
                          ></solid-display>
                        </div>
                        <solid-display
                          bind-resources=""
                          fields="ofn:First_Nations_country"
                          widget-ofn:First_Nations_country="custom-display-firstnationsled"
                        ></solid-display>
                        <!-- Commented: No map link in resource? -->
                        <!-- <div class="row valign-wrapper">
                          <div class="col s12 text-link text-link-red">
                            View map<icon-mdi-open-in-new
                            ></icon-mdi-open-in-new>
                          </div>
                        </div> -->
                        <h5 class="margin-top-50">Useful links</h5>
                        <solid-display
                          bind-resources=""
                          fields="ofn:Household_URL"
                          widget-ofn:Household_URL="custom-display-householdurl"
                        ></solid-display>
                        <div class="row no-margin-bottom">
                          <solid-display
                            bind-resources=""
                            fields="dfc-b:hasSocialMedia"
                            widget-dfc-b:hasSocialMedia="custom-social-links"
                          ></solid-display>
                        </div>
                      </div>
                      <conditional-display
                        bind-resources=""
                        condition="ofn:promo_image_url|ofn:long_description|ofn:Practices">
                        <div class="col s12 m9">
                          <conditional-display
                            bind-resources=""
                            condition="ofn:promo_image_url|ofn:long_description">
                            <conditional-display
                              bind-resources=""
                              condition="ofn:promo_image_url">
                              <div class="row">
                                <solid-display
                                  bind-resources=""
                                  fields="ofn:promo_image_url"
                                  widget-ofn:promo_image_url="custom-display-image"
                                  class-ofn:promo_image_url="flex-img bg-img-container"
                                  class="col hide-on-small-only m12 margin-top-10"
                                  style="height: 212px;"
                                ></solid-display>
                              </div>
                            </conditional-display>
                            <conditional-display
                              bind-resources=""
                              condition="ofn:long_description">
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
                            </conditional-display>
                          </conditional-display>
                          <conditional-display
                            bind-resources=""
                            condition="ofn:Practices">
                            <h5>Practices</h5>
                            <solid-display
                              bind-resources=""
                              fields="ofn:Practices"
                              widget-ofn:Practices="custom-multiple-badge-list"
                            ></solid-display>
                          </conditional-display>
                        </div>
                      </conditional-display>
                    </div>
                  </div>
                </div>
              </div>
              <conditional-display
                bind-resources=""
                condition="ofn:hasSupportingEvidence">
                <h4 id="${this.uniq}-supporting-evidence">
                  Supporting evidence
                </h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-padding">
                      <div class="row">
                        <custom-supporting-evidence bind-resources=""></custom-supporting-evidence>
                      </div>
                    </div>
                  </div>
                </div>
              </conditional-display>
              <custom-contact-form bind-resources="" uniq="${this.uniq}"></custom-contact-form>
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
          ${import.meta.env.DEV ? html`
            <nav>
              <div class="nav-wrapper">
                <a href="#" class="hide-on-small-only brand-logo">Examples</a>
                <ul class="right">
                  <li>
                    <solid-link next="regenerative-produce-portal-producers-list">
                      <a><icon-mdi-home-silo></icon-mdi-home-silo> Producers List</a>
                    </solid-link>
                  </li>
                  <li>
                    <solid-link next="regenerative-produce-portal-products-list">
                      <a><icon-mdi-food-apple></icon-mdi-food-apple> Products List</a>
                    </solid-link>
                  </li>
                  <li class="hide-on-small-only">
                    <solid-link
                      next="regenerative-produce-portal-producer-details"
                      data-src="https://api.regenerative.org.au/webhook/regen/producer?id=recjBYlXskXtilPBC"
                    >
                      <a><icon-mdi-home-silo></icon-mdi-home-silo> Producer Details</a>
                    </solid-link>
                  </li>
                </ul>
              </div>
            </nav>` : nothing}
          ${this.viewProductsList()}
          ${this.viewProducersList()}
          ${this.viewProducerDetails()}
        `;
      }
    }
  );
});
