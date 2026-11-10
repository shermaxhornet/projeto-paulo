# Paulinho Store

Static storefront built with HTML, CSS, and JavaScript. The site reads its catalog from `data/products.json` and loads product photos from `img/tenis/`.

## Catalog fields

Each product entry uses `id`, `nome`, `categoria`, `marca`, and `imagem`. The current category is `tenis`; brand options are generated from the `marca` values in the catalog. No prices or availability are fabricated.

To add a product, place its image in the matching brand folder under `img/tenis/` and add an entry to `data/products.json` with a unique ID and the relative image path. The brand filter updates automatically from the data.

For local preview, open the project with VS Code Live Server. GitHub Pages serves `index.html` directly; no build step or package installation is required.
