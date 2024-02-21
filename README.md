# Solid OFN-RPP

```html
<script type="module" src="https://cdn.skypack.dev/@startinblox/core@0.19"></script>
<script type="module" src="https://cdn.skypack.dev/@startinblox/router@0.11"></script>
<script type="module" src="https://cdn.skypack.dev/@startinblox/component-ofn-rpp"></script>

<solid-ofn-rpp producers-src="https://n8n.openfoodnetwork.org.uk/webhook/regen/producers" products-src="https://n8n.openfoodnetwork.org.uk/webhook/regen/products" uniq="regenerative-produce-portal"></solid-ofn-rpp>
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
