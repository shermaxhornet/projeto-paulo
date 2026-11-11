# Paulinho Store

Static storefront built with HTML, CSS, and JavaScript. The site reads its catalog from `data/products.json` and loads sneaker photos from `img/tenis/`, shirt photos from `img/camisas/`, blouse photos from `img/blusas/`, and bag photos from `img/bolsa/`.

## Catalog fields

Each product entry uses `id`, `nome`, `categoria`, `marca`, and `imagem`. Shirt entries may also include `imagens` for an interactive photo gallery. The catalog includes `tenis`, `camisas`, `blusas`, `shorts`, `blusa-de-frio`, and `bolsas`; category and brand options are generated from the catalog data. No prices or availability are fabricated.

To add a product, place its image in the matching category folder and add an entry to `data/products.json` with a unique ID and the relative image path. The brand filter updates automatically from the data.

For local preview, open the project with VS Code Live Server. GitHub Pages serves `index.html` directly; no build step or package installation is required.



