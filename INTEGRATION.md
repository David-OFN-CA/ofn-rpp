# Integrate OFN RPP Component into WP

In your WP `<head>`

```html
<script type="module" src="https://cdn.skypack.dev/@startinblox/core@0.19"></script>
<script type="module" src="https://cdn.skypack.dev/@startinblox/router@0.11"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@startinblox/component-ofn-rpp"></script>
```

On an empty page:

```html
<solid-ofn-rpp
  producers-src="https://api.regenerative.org.au/webhook/regen/producers"
  products-src="https://api.regenerative.org.au/webhook/regen/products"
  range-product-categories="https://api.regenerative.org.au/webhook/regen/produce_categories"
  range-producer-assurances="https://api.regenerative.org.au/webhook/regen/assurance_partners"
  uniq="regenerative-produce-portal"
  route-prefix="some-path"></solid-ofn-rpp>
```

Replace `some-path` with the path to your page. For example, with the "Post name" permalink setting within WP: `/my-page/` -> `route-prefix="my-page"`

Then, configure your htaccess:

Rewrite `my-page/.+` to `/my-page/`, example:

```htaccess
RewriteRule ^my-page/.+$ /my-page/ [L]
```

This must be done before the WP rewrite rules.

## Create a link to producers list

```html
<solid-link next="regenerative-produce-portal-producers-list">
  <a>Producers List</a>
</solid-link>
```

## Create a link to products list

```html
<solid-link next="regenerative-produce-portal-products-list">
  <a>Products List</a>
</solid-link>
```

## More customization

The `uniq` attribute serves as the identifier for the component and also acts as a prefix for the subrouter. Although required, you are welcome to assign it any value that suits your needs.
