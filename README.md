# Solid OFN-RPP

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@startinblox/core@1/+esm"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@startinblox/router@0.13/+esm"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@startinblox/component-ofn-rpp@waterloo"></script>

<solid-ofn-rpp
      producers-src="https://api.regenerative.org.au/webhook/regen_CAN/producers"
      range-product-categories="https://api.regenerative.org.au/webhook_CAN/regen/produce_categories"
      range-producer-assurances="https://api.regenerative.org.au/webhook_CAN/regen/assurance_partners"
      uniq="regenerative-produce-portal"
      route-prefix="some-facultative-wordpress-path"></solid-ofn-rpp>
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
