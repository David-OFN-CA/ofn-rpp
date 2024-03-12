# Solid OFN-RPP

```html
<script type="module" src="https://cdn.skypack.dev/@startinblox/core@0.19"></script>
<script type="module" src="https://cdn.skypack.dev/@startinblox/router@0.12"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@startinblox/component-ofn-rpp"></script>

<solid-ofn-rpp
      producers-src="https://api.regenerative.org.au/webhook/regen/producers"
      products-src="https://api.regenerative.org.au/webhook/regen/products"
      range-product-categories="https://api.regenerative.org.au/webhook/regen/produce_categories"
      range-producer-certifications="https://api.regenerative.org.au/webhook/regen/certifications"
      range-producer-supporting-evidence="https://api.regenerative.org.au/webhook/regen/supporting_evidence"
      range-producer-assurances="https://api.regenerative.org.au/webhook/regen/assurance_partners"
      uniq="regenerative-produce-portal"
      route-prefix="some-wordpress-path"></solid-ofn-rpp>
```

## Developpers

### Installation

```bash
npm install
```

Build for production with:

```bash
npm run build
# npm run serve
```

Build for dev while watching for changes with:

```bash
npm run watch
```

### Icons

Based on [unplugin-icons](https://github.com/unplugin/unplugin-icons) - webcomponent method.

```js
import '~icons/mdi/account-box';
/* ... */
<icon-mdi-account-box></icon-mdi-account-box>
```
