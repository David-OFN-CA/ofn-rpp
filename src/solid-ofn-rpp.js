import style from "./styles/index.scss?inline";
import "materialize-css/dist/js/materialize.min.js"; // Not required
// import 'materialize-css/js/cash.js';
// import 'materialize-css/js/component.js';
// import 'materialize-css/js/global.js';
// import 'materialize-css/js/anime.min.js';
// import 'materialize-css/js/collapsible.js';
// import 'materialize-css/js/dropdown.js';
// import 'materialize-css/js/modal.js';
// import 'materialize-css/js/materialbox.js';
// import 'materialize-css/js/parallax.js';
// import 'materialize-css/js/tabs.js';
// import 'materialize-css/js/tooltip.js';
// import 'materialize-css/js/waves.js';
// import 'materialize-css/js/toasts.js';
// import 'materialize-css/js/sidenav.js';
// import 'materialize-css/js/scrollspy.js';
// import 'materialize-css/js/autocomplete.js';
// import 'materialize-css/js/forms.js';
// import 'materialize-css/js/slider.js';
// import 'materialize-css/js/cards.js';
// import 'materialize-css/js/chips.js';
// import 'materialize-css/js/pushpin.js';
// import 'materialize-css/js/buttons.js';
// import 'materialize-css/js/datepicker.js';
// import 'materialize-css/js/timepicker.js';
// import 'materialize-css/js/characterCounter.js';
// import 'materialize-css/js/carousel.js';
// import 'materialize-css/js/tapTarget.js';
// import 'materialize-css/js/select.js';
// import 'materialize-css/js/range.js';
import "~icons/mdi/home-silo";
import "~icons/mdi/food-apple";
import "~icons/mdi/open-in-new";
import "~icons/mdi/facebook";
import "~icons/mdi/instagram";
import "~icons/mdi/linkedin";
import "~icons/mdi/whatsapp";
import("./utils.js").then((utils) => {
  import(/* @vite-ignore */ utils.coreVersion()).then((core) => {
    // Custom widget for producer description, original contains some unsafe html
    customElements.define(
      "custom-safe-html-value",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          return utils.sanitize(value, false);
        }
      }
    );
    // Custom widget for producer description, original contains some unsafe html, truncated
    customElements.define(
      "custom-safe-html-value-short",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          return utils.truncate(utils.sanitize(value), 125);
        }
      }
    );

    // Custom widget for badges (simple array)
    customElements.define(
      "custom-multiple-badge",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          const badges = value.split(",");
          let res = "";
          for (let badge of badges) {
            if (badge.length > 0) {
              res += `<div class="chip">${badge}</div>`;
            }
          }
          return res;
        }
      }
    );

    // Custom widget for First Nations Led
    customElements.define(
      "custom-badge-firstnationsled",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          if (value.length > 0) {
            return `<div class="chip first_nations_led">First Nations Led</div>`;
          } else {
            return "";
          }
        }
      }
    );

    // Custom widget for filtering First Nations Led
    customElements.define(
      "custom-search-firstnationsled",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          return `<div class="switch">
            <label>
              First Nations Led
              <input type="checkbox" onchange="javascript:document.querySelector('[filtered-by=producers-list-filters-${value}]').toggleAttribute('required-ofn:First_Nations_country');document.querySelector('[filtered-by=producers-list-filters-${value}]').component.populate();">
              <span class="lever"></span>
            </label>
          </div>`;
        }
      }
    );

    // Custom widget for filtering First Nations Led on products
    customElements.define(
      "custom-search-firstnationsled-products",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value",
          };
        }
        template({ value }) {
          return `<div class="switch">
            <label>
              First Nations Led
              <input type="checkbox" onchange="javascript:document.querySelector('[filtered-by=products-list-filters-${value}]').toggleAttribute('required-dfc-b:suppliedBy.ofn:First_Nations_country');document.querySelector('[filtered-by=products-list-filters-${value}]').component.populate();">
              <span class="lever"></span>
            </label>
          </div>`;
        }
      }
    );

    // Custom widget for social media links
    core.Sib.register({
      name: "custom-social-links",
      use: [core.StoreMixin],
      empty() {
        this.element.innerHTML = '';
      },
      async populate() {
        this.element.innerHTML += `
          <div class="row">`;
        for(let social of this.resource["ldp:contains"]) {
          let app = (await social["dfc-b:name"]).replace("_phone", "");
          let link = await social["dfc-b:URL"];
          if (!/^https?:\/\//i.test(link)) {
            link = "https://" + link;
          }
          this.element.innerHTML += `
            <div class="col"><a class="social-link" href="${link}" target="_blank"><icon-mdi-${app} class="icon"></icon-mdi-${app}></a></div>
          `;
        }
        this.element.innerHTML += `
          </div>`;
      }
    });

    customElements.define(
      "solid-ofn-rpp",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
          this.setTranslationsPath(`${utils.path()}/locales`);
        }

        static get propsDefinition() {
          return {
            producersSrc: "producers-src",
            productsSrc: "products-src",
            uniq: "uniq",
          };
        }

        styles() {
          let render = `
          <style>${style}</style>
          <script id="client-context" type="application/ld+json" data-default-context>
            ${JSON.stringify(utils.CLIENT_CONTEXT)}
          </script>
          `;
          return render;
        }

        routers() {
          let render = `
          <solid-router default-route="${this.route}-producers-list">
            <solid-route name="${this.route}-producers-list"></solid-route>
            <solid-route name="${this.route}-products-list"></solid-route>
            <solid-route name="${this.route}-producer-details" use-id></solid-route>
          </solid-router>
          `;
          return render;
        }

        viewWidgets() {
          let render = ``;
          return render;
        }

        viewProducersList(props = {}) {
          setTimeout(() => {
            const producers = core.store.getData(
              this.producersSrc,
              utils.CLIENT_CONTEXT
            );
            let producerNames = [],
              productCategories = [],
              addresses = [];
            producers.then(async (p) => {
              for (let producer of p["ldp:contains"]) {
                let producerName = await producer["dfc-b:name"];
                if (producerName) {
                  producerNames.push(producerName);
                }
                let producerCategories = await producer["ofn:Produce_category"];
                if (producerCategories) {
                  productCategories =
                    productCategories.concat(producerCategories);
                }
                let producerAddress = await producer["dfc-b:hasAddress"];
                if (producerAddress) {
                  let producerStreet = await producerAddress["dfc-b:hasStreet"];
                  if (producerStreet) {
                    addresses.push(producerStreet);
                  }
                  let producerPostalCode = await producerAddress[
                    "dfc-b:hasPostalCode"
                  ];
                  if (producerStreet) {
                    addresses.push(producerPostalCode);
                  }
                  let producerCity = await producerAddress["dfc-b:hasCity"];
                  if (producerStreet) {
                    addresses.push(producerCity);
                  }
                  let producerCountry = await producerAddress["dfc-b:hasCountry"];
                  if (producerStreet) {
                    addresses.push(producerCountry);
                  }
                }
              }

              producerNames = Array.from(new Set(producerNames.sort())).reduce(
                (acc, value) => ({ ...acc, [value]: null }),
                {}
              );
              productCategories = Array.from(
                new Set(productCategories.sort())
              ).join(", ");
              // NOTICE: change to mutation observer
              document
                .querySelector(
                  `#producers-list-filters-${this.uniq}`
                )
                .setAttribute("enum-ofn:Produce_category", productCategories);
              document
                .querySelector(
                  'solid-form-dropdown-placeholder[name="ofn:Produce_category"]'
                )
                .setAttribute("enum", productCategories);

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
                      document.querySelector(`[filtered-by=producers-list-filters-${this.uniq}]`).component.populate();
                    },
                  }
                );
                M.Autocomplete.init(
                  document.querySelectorAll('input[type="text"][name="address"]'),
                  {
                    data: addresses,
                    limit: 3,
                    onAutocomplete: () => {
                      document.querySelector(`[filtered-by=producers-list-filters-${this.uniq}]`).component.populate();
                    },
                  }
                );
                M.FormSelect.init(document.querySelectorAll("select"));
              }, 0);
            });
          }, 0);

          let render = `
            <div id="${this.route}-producers-list" data-view="${this.route}-producers-list" class="row producers-list">
              <div class="col s12 m4">
                <div class="row">
                  <div class="col s12 m9 offset-m2">
                    <!--<div class="loader" id="loader-producers-list-filters-${this.uniq}">
                      <div class="progress">
                        <div class="indeterminate"></div>
                      </div>
                    </div>-->
                    <solid-form-search
                      id="producers-list-filters-${this.uniq}"
                      loader-id="loader-producers-list-filters-${this.uniq}"
                      fields="set-line-field(set-line-field-col(set-line-field-panel(search-field))), filterBy-row(filterBy), set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(ofn:First_Nations_country)))), set-line-ecological(set-line-ecological-col(set-line-ecological-panel(set-line-ecological-wrapper(ofn:Supporting_evidence)))), set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:Produce_category)))), set-line-assurance(set-line-assurance-col(set-line-assurance-panel(set-line-assurance-wrapper(ofn:Assurance_partnerships)))), set-line-certifications(set-line-certifications-col(set-line-certifications-panel(set-line-certifications-wrapper(ofn:Certifications)))), set-line-address(set-line-address-col(set-line-address-panel(set-line-address-wrapper(address))))"

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
                      value-ofn:First_Nations_country="${this.uniq}"
                      widget-ofn:First_Nations_country="custom-search-firstnationsled"
                      class-ofn:First_Nations_country="input-field col s12"

                      widget-set-line-ecological="div"
                      class-set-line-ecological="row no-margin-bottom"
                      widget-set-line-ecological-col="div"
                      class-set-line-ecological-col="col s12"
                      widget-set-line-ecological-panel="div"
                      class-set-line-ecological-panel="filter card horizontal"
                      widget-set-line-ecological-wrapper="div"
                      class-set-line-ecological-wrapper="card-content padding"
                      auto-range-ofn:Supporting_evidence=""
                      widget-ofn:Supporting_evidence='solid-form-dropdown-placeholder'
                      class-ofn:Supporting_evidence="col s12"
                      label-ofn:Supporting_evidence="Ecological outcomes"

                      widget-set-line-produce="div"
                      class-set-line-produce="row no-margin-bottom"
                      widget-set-line-produce-col="div"
                      class-set-line-produce-col="col s12"
                      widget-set-line-produce-panel="div"
                      class-set-line-produce-panel="filter card horizontal"
                      widget-set-line-produce-wrapper="div"
                      class-set-line-produce-wrapper="card-content padding"
                      enum-ofn:Produce_category=""
                      widget-ofn:Produce_category='solid-form-dropdown-placeholder'
                      class-ofn:Produce_category="col s12"
                      label-ofn:Produce_category="Produce types"

                      widget-set-line-assurance="div"
                      class-set-line-assurance="row no-margin-bottom"
                      widget-set-line-assurance-col="div"
                      class-set-line-assurance-col="col s12"
                      widget-set-line-assurance-panel="div"
                      class-set-line-assurance-panel="filter card horizontal"
                      widget-set-line-assurance-wrapper="div"
                      class-set-line-assurance-wrapper="card-content padding"
                      auto-range-ofn:Assurance_partnerships=""
                      widget-ofn:Assurance_partnerships='solid-form-dropdown-placeholder'
                      class-ofn:Assurance_partnerships="col s12"
                      label-ofn:Assurance_partnerships="Assurance Partners"

                      widget-set-line-certifications="div"
                      class-set-line-certifications="row no-margin-bottom"
                      widget-set-line-certifications-col="div"
                      class-set-line-certifications-col="col s12"
                      widget-set-line-certifications-panel="div"
                      class-set-line-certifications-panel="filter card horizontal"
                      widget-set-line-certifications-wrapper="div"
                      class-set-line-certifications-wrapper="card-content padding"
                      auto-range-ofn:Certifications=""
                      widget-ofn:Certifications='solid-form-dropdown-placeholder'
                      class-ofn:Certifications="col s12"
                      label-ofn:Certifications="Certifications"

                      widget-set-line-address="div"
                      class-set-line-address="row no-margin-bottom"
                      widget-set-line-address-col="div"
                      class-set-line-address-col="col s12"
                      widget-set-line-address-panel="div"
                      class-set-line-address-panel="filter card horizontal"
                      widget-set-line-address-wrapper="div"
                      class-set-line-address-wrapper="card-content"
                      search-address="dfc-b:hasAddress.dfc-b:hasStreet, dfc-b:hasAddress.dfc-b:hasPostalCode, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry"
                      widget-address='solid-form-label-text'
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
                  fields="set-card-row(set-card-col(set-card-panel(set-card-wrapper(set-left-panel(ofn:logo_url), set-right-panel(set-title(dfc-b:name, dfc-b:hasAddress.dfc-b:hasCity, dfc-b:hasAddress.dfc-b:hasCountry), set-description(ofn:long_description), set-tags(ofn:First_Nations_country, ofn:Produce_category))))))"

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
                  widget-ofn:First_Nations_country="custom-badge-firstnationsled"
                  widget-ofn:Produce_category="custom-multiple-badge"

                  next="${this.route}-producer-details"
                  ></solid-display>
                </div>
            </div>
          `;
          return render;
        }

        viewProductsList(props = {}) {
          setTimeout(() => {
            core.store.clearCache(this.productsSrc);
            const products = core.store.getData(
              this.productsSrc,
              utils.CLIENT_CONTEXT
            );
            let productNames = [],
                productCategories = [];
            products.then(async (p) => {
              for (let product of p["ldp:contains"]) {
                let productName = await product["dfc-b:name"];
                if (productName) {
                  productNames.push(productName);
                }
                let productCategory = await product["ofn:Type"];
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
                .querySelector(
                  `#products-list-filters-${this.uniq}`
                )
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
                      document.querySelector(`[filtered-by=products-list-filters-${this.uniq}]`).component.populate();
                    },
                  }
                );
                M.FormSelect.init(document.querySelectorAll("select"));
              }, 0);
            });
          }, 0);
          let render = `
            <div id="${this.route}-products-list" data-view="${this.route}-products-list" class="row products-list">
              <div class="col s12 m4">
                <div class="row">
                  <div class="col s12 m9 offset-m2">
                    <!--<div class="loader" id="loader-products-list-filters-${this.uniq}">
                      <div class="progress">
                        <div class="indeterminate"></div>
                      </div>
                    </div>-->
                    <solid-form-search
                      id="products-list-filters-${this.uniq}"
                      loader-id="loader-products-list-filters-${this.uniq}"
                      fields="set-line-field(set-line-field-col(set-line-field-panel(search-field-product))), filterBy-row(filterBy), set-line-fnc(set-line-fnc-col(set-line-fnc-panel(set-line-fnc-wrapper(dfc-b:suppliedBy.ofn:First_Nations_country)))), set-line-ecological(set-line-ecological-col(set-line-ecological-panel(set-line-ecological-wrapper(dfc-b:suppliedBy.ofn:Supporting_evidence)))), set-line-produce(set-line-produce-col(set-line-produce-panel(set-line-produce-wrapper(ofn:Type)))), set-line-assurance(set-line-assurance-col(set-line-assurance-panel(set-line-assurance-wrapper(dfc-b:suppliedBy.ofn:Assurance_partnerships))))"

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
                      value-dfc-b:suppliedBy.ofn:First_Nations_country="${this.uniq}"
                      widget-dfc-b:suppliedBy.ofn:First_Nations_country="custom-search-firstnationsled-products"
                      class-dfc-b:suppliedBy.ofn:First_Nations_country="input-field col s12"

                      widget-set-line-ecological="div"
                      class-set-line-ecological="row no-margin-bottom"
                      widget-set-line-ecological-col="div"
                      class-set-line-ecological-col="col s12"
                      widget-set-line-ecological-panel="div"
                      class-set-line-ecological-panel="filter card horizontal"
                      widget-set-line-ecological-wrapper="div"
                      class-set-line-ecological-wrapper="card-content padding"
                      auto-range-dfc-b:suppliedBy.ofn:Supporting_evidence=""
                      widget-dfc-b:suppliedBy.ofn:Supporting_evidence='solid-form-dropdown-placeholder'
                      class-dfc-b:suppliedBy.ofn:Supporting_evidence="col s12"
                      label-dfc-b:suppliedBy.ofn:Supporting_evidence="Ecological outcomes"

                      widget-set-line-produce="div"
                      class-set-line-produce="row no-margin-bottom"
                      widget-set-line-produce-col="div"
                      class-set-line-produce-col="col s12"
                      widget-set-line-produce-panel="div"
                      class-set-line-produce-panel="filter card horizontal"
                      widget-set-line-produce-wrapper="div"
                      class-set-line-produce-wrapper="card-content padding"
                      enum-ofn:Type=""
                      widget-ofn:Type='solid-form-dropdown-placeholder'
                      class-ofn:Type="col s12"
                      label-ofn:Type="Produce types"

                      widget-set-line-assurance="div"
                      class-set-line-assurance="row no-margin-bottom"
                      widget-set-line-assurance-col="div"
                      class-set-line-assurance-col="col s12"
                      widget-set-line-assurance-panel="div"
                      class-set-line-assurance-panel="filter card horizontal"
                      widget-set-line-assurance-wrapper="div"
                      class-set-line-assurance-wrapper="card-content padding"
                      auto-range-dfc-b:suppliedBy.ofn:Assurance_partnerships=""
                      widget-dfc-b:suppliedBy.ofn:Assurance_partnerships='solid-form-dropdown-placeholder'
                      class-dfc-b:suppliedBy.ofn:Assurance_partnerships="col s12"
                      label-dfc-b:suppliedBy.ofn:Assurance_partnerships="Assurance Partners"
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

        viewProducerDetails(props = {}) {
          let render = `
            <div id="${this.route}-producer-details" data-view="${this.route}-producer-details" class="row producer-details">
              <div class="col s10 offset-s1">
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round">
                      <div class="row valign-wrapper title-header no-margin-bottom">
                        <div class="col s3"></div>
                        <div class="col s9 z-index-2">
                          <solid-display
                            bind-resources=""
                            fields="ofn:Produce_category"
                            widget-ofn:Produce_category="custom-multiple-badge"
                          ></solid-display>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s3">
                          <solid-display
                            bind-resources=""
                            fields="ofn:logo_url"
                            class-ofn:logo_url="circle img-120 img-logo"
                            widget-ofn:logo_url="solid-display-img"
                            default-ofn:logo_url="https://placehold.co/120"
                          ></solid-display>
                        </div>
                        <div class="col s8 margin-top-10">
                          <div class="row no-margin-bottom">
                            <solid-display
                              bind-resources=""
                              fields="dfc-b:name"
                              widget-dfc-b:name="solid-display-value"
                              class-dfc-b:name="col s12 flow-text"
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
                            <a class="col s12 learn-more" href="#${this.uniq}-about-us">Learn more about us</a>
                          </div>
                          <hr />
                          <div class="row">
                            <div class="col s6">
                              <div class="row"><div class="col s12"><span class="bold-16-21">Assurance Partners</span></div></div>
                              <div class="row"><div class="col s12"><a class="learn-more" href="#${this.uniq}-supporting-evidence">Learn more</a></div></div>
                              <div class="row"><div class="col s12"><img class="responsive-img" src="/sustainable_table.png" /></div></div>
                              <div class="row"><div class="col s12"><span class="text-14 text-light bold underline">Sustainable Table</span></div></div>
                            </div>
                            <div class="col s6">
                              <div class="row"><div class="col s12"><span class="bold-16-21">Supporting Evidence</span></div></div>
                              <div class="row"><div class="col s12"><a class="learn-more" href="#${this.uniq}-supporting-evidence">Learn more</a></div></div>
                              <div class="row no-margin-bottom"><div class="col s12"><div class="chip small text-12 peach">1</div><span class="text-14 text-light"> for <span class="underline">ecological outcomes</span></span></div></div>
                              <div class="row no-margin-bottom"><div class="col s12"><div class="chip small text-12 peach">2</div><span class="text-14 text-light"> for <span class="underline">practices</span></span></div></div>
                              <div class="row no-margin-bottom"><div class="col s12"><div class="chip small text-12 peach">1</div><span class="text-14 text-light"> for <span class="underline">participation</span></span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-how-to-buy">How to buy</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="card-panel card-round">
                      <div class="row">
                        <div class="col s4">
                          <h5>Wholesale customers</h5>
                          <div class="row">
                            <solid-display
                              bind-resources=""
                              fields="dfc-b:hasDescription"
                              class-dfc-b:hasDescription="col s12 text-14 text-light"
                            ></solid-display>
                          </div>
                          <div class="row"><div class="col s12"><a href="#${this.uniq}-contact-producer" class="waves-effect waves-light btn-small">View contact details</a></div></div>
                          <div class="row text-light no-margin-bottom"><div class="col s12">Open Food Network</div></div>
                          <div class="row text-link valign-wrapper"><div class="col s8">Visit website</div><div class="col s4"><icon-mdi-open-in-new></icon-mdi-open-in-new></div></div>
                          <div class="row text-light no-margin-bottom"><div class="col s12">Fresho</div></div>
                          <div class="row text-link valign-wrapper"><div class="col s8">Visit website</div><div class="col s4"><icon-mdi-open-in-new></icon-mdi-open-in-new></div></div>
                          <div class="row text-light no-margin-bottom"><div class="col s12">Some other portal</div></div>
                          <div class="row text-link valign-wrapper"><div class="col s8">Visit website</div><div class="col s4"><icon-mdi-open-in-new></icon-mdi-open-in-new></div></div>
                          <h6 class="margin-top-50">Household customers</h6>
                          <div class="row text-light no-margin-bottom"><div class="col s12">Our eCommerce</div></div>
                          <div class="row text-link valign-wrapper"><div class="col s8">Visit website</div><div class="col s4"><icon-mdi-open-in-new></icon-mdi-open-in-new></div></div>
                        </div>
                        <div class="col s8">
                          <h5>Feature products</h5>
                          <!--
                          bind-resources=""
                          nested-field="dfc-b:supplies"
                          -->
                          <solid-display
                            data-src="${this.productsSrc}"
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
                    <div class="card-panel card-round">
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
                              required-ofn:First_Nations_country=""
                              fields="title, fnc(ofn:First_Nations_country)"
                              value-title="First Nation Country"
                              class-title="col s12 text-14 bold"
                              class-fnc="col s12 text-14"
                            ></solid-display>
                          </div>
                          <div class="row text-link valign-wrapper"><div class="col s12">View map&nbsp;<icon-mdi-open-in-new></icon-mdi-open-in-new></div></div>
                          <h5 class="margin-top-50">Useful links</h5>
                          <div class="row no-margin-bottom"><div class="col s12">
                          <solid-display
                            bind-resources=""
                            fields="ofn:Household_URL"
                            link-text-ofn:Household_URL="Visit our website"
                            class-ofn:Household_URL="text-link text-red"
                            widget-ofn:Household_URL="solid-display-link-blank"
                          ></solid-display></div></div>
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
                            <div class="col hide-on-small-only m12 margin-top-10">
                              <img class="responsive-img" src="/kialla_silos.png" />
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
                            widget-ofn:Practices="custom-multiple-badge"
                          ></solid-display>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-supporting-evidence">Supporting evidence</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="row">
                      <div class="col s3">
                      </div>
                      <div class="col s8">
                      </div>
                    </div>
                  </div>
                </div>
                <h4 id="${this.uniq}-contact-producer">Contact Producer</h4>
                <div class="row">
                  <div class="col s12">
                    <div class="row">
                      <div class="col s3">
                      </div>
                      <div class="col s8">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return render;
        }

        template(props) {
          this.producersSrc = props.producersSrc;
          this.productsSrc = props.productsSrc;
          this.uniq = props.uniq || utils.uniq();
          this.route = this.uniq;
          return `
            ${this.styles()}
            ${this.routers()}
            ${this.viewProductsList()}
            ${this.viewProducersList()}
            ${this.viewProducerDetails()}
          `;
        }

        _camelize(str) {
          return str.replace(/[-]+(.)/g, (match, chr) => chr.toUpperCase());
        }

        _uncamelize(str) {
          return str.replace(
            /[A-Z]+/g,
            (match, chr) => "-" + match.toLowerCase()
          );
        }
      }
    );
  });
});
