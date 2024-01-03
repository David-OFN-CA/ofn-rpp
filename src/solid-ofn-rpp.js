import style from './styles/index.scss?inline';
import('./utils.js').then(utils => {
  import(/* @vite-ignore */utils.coreVersion()).then(core => {
    customElements.define(
      "solid-ofn-rpp",
      class extends core.SolidTemplateElement {
        constructor() {
          super();
          this.setTranslationsPath(`${utils.path()}/locales`);
        }

        static get propsDefinition() {
          return {
            apiSrc: "api-src",
            uniq: "uniq"
          };
        }

        styles() {
          let render = `
          <style>${style}</style>
          `;
          return render;
        }

        routers() {
          let render = `
          <nav id="${this.uniq}-nav">
            <solid-router default-route="${this.route}-producers-list">
              <ul>
                <solid-route name="${this.route}-producers-list">
                  <li>
                    <a>${this.localize('producersList.name')}</a>
                  </li>
                </solid-route>
                <solid-route name="${this.route}-products-list">
                  <li>
                    <a>${this.localize('productsList.name')}</a>
                  </li>
                </solid-route>
                <solid-route name="${this.route}-producer-details">
                  <li>
                    <a>${this.localize('producerDetails.name')}</a>
                  </li>
                </solid-route>
                <solid-route name="${this.route}-product-details">
                  <li>
                    <a>${this.localize('productDetails.name')}</a>
                  </li>
                </solid-route>
              </ul>
            </solid-router>
          </nav>
          `;
          return render;
        }

        viewWidgets() {
          let render = ``;
          return render;
        }

        viewProducersList(props={}) {
          let render = `
            <div id="${this.route}-producers-list" data-view="${this.route}-producers-list">
              Hello World!
            </div>
          `;
          return render;
        }

        viewProductsList(props={}) {
          let render = `
            <div id="${this.route}-products-list" data-view="${this.route}-products-list">
              Hello World!
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
          this.apiSrc = props.apiSrc;
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
