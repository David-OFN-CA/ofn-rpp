import style from './styles/index.scss?inline';
// import 'materialize-css/dist/js/materialize.min.js'; // Not required
import '~icons/mdi/home-silo';
import '~icons/mdi/food-apple';
import('./utils.js').then(utils => {
  import(/* @vite-ignore */utils.coreVersion()).then(core => {

    // Custom widget for producer description, original contains some unsafe html
    customElements.define("safe-html-value",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
        }
        static get propsDefinition() {
          return {
            value: "value"
          };
        }
        template({
          value
        }) {
          return utils.truncate(utils.sanitize(value), 125);
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
            uniq: "uniq"
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
            <solid-route name="${this.route}-product-details" use-id></solid-route>
          </solid-router>
          `;
          return render;
        }

        viewWidgets() {
          let render = ``;
          return render;
        }

        viewProducersList(props={}) {
          let render = `
            <div id="${this.route}-producers-list" data-view="${this.route}-producers-list" class="row">
              <div class="col s4"></div>
              <div class="col s8">
                <solid-display
                  data-src="${this.producersSrc}"
                  fields="set-card-row(set-card-col(set-card-panel(set-card-wrapper(set-left-panel(ofn:logo_url), set-right-panel(set-title(dfc-b:name, dfc-b:hasAddress.dfc-b:hasCity), set-description(ofn:long_description), set-tags(ofn:First_Nations_country, ofn:Produce_category))))))"

                  widget-set-card-row="div"
                  class-set-card-row="row"
                  widget-set-card-col="div"
                  class-set-card-col="col s12"
                  widget-set-card-panel="div"
                  class-set-card-panel="card-panel z-depth-1"
                  widget-set-card-wrapper="div"
                  class-set-card-wrapper="row valign-wrapper"

                  widget-set-left-panel="div"
                  class-set-left-panel="col s2"
                  class-ofn:logo_url="responsive-img"
                  widget-ofn:logo_url="solid-display-img"
                  default-ofn:logo_url="https://placehold.co/120"

                  widget-set-right-panel="div"
                  class-set-right-panel="col s10"

                  widget-set-title="div"
                  widget-dfc-b:name="solid-display-value"
                  class-dfc-b:name="dfc_b_name bold"
                  widget-dfc-b:hasAddress.dfc-b:hasCity="solid-display-value"

                  widget-set-description="div"
                  widget-ofn:long_description="safe-html-value"

                  widget-set-tags="div"
                  widget-ofn:First_Nations_country="solid-display-value"
                  widget-ofn:Produce_category="solid-display-value"

                  ></solid-display>
                </div>
            </div>
          `;
          return render;
        }

        viewProductsList(props={}) {
          let render = `
            <div id="${this.route}-products-list" data-view="${this.route}-products-list">
            <solid-display
              data-src="${this.productsSrc}"
            ></solid-display>
            </div>
          `;
          return render;
        }

        viewProducerDetails(props={}) {
          let render = `
            <div id="${this.route}-producer-details" data-view="${this.route}-producer-details">
              Hello World!
            </div>
          `;
          return render;
        }

        viewProductDetails(props={}) {
          let render = `
            <div id="${this.route}-product-details" data-view="${this.route}-product-details">
              Hello World!
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
            ${this.viewProductDetails()}
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
