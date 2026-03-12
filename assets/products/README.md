# Product Images Directory

## Folder Structure
Each product has its own folder. Place images according to this convention:

```
assets/products/
├── ecoza/
│   ├── header.png          ← Circular icon on product detail page
│   ├── technical_1.png     ← Formulation diagram / chart
│   ├── technical_2.png     ← Label image
│   └── ...
├── spindura/
│   ├── header.png
│   └── technical_1.png
├── margo/
│   └── header.png
└── ...
```

## Image Types

| Type | Purpose | Size | Used In |
|------|---------|------|---------|
| `header.png` | Product icon (circular crop) | 160x160px recommended | Hero card icon |
| `technical_N.png` | Diagrams, charts, labels | Any (displayed full-width) | Technical Profile section |

## How to Add Images

1. Place the image file in the product's folder
2. Open `src/constants/productData.js`
3. Add to `PRODUCT_IMAGES` (for header) or `TECHNICAL_IMAGES` (for technical):

```js
const PRODUCT_IMAGES = {
  'Ecoza Max': require('../../assets/products/ecoza/header.png'),
};

const TECHNICAL_IMAGES = {
  'Ecoza Max': [
    { label: 'Formulation Diagram', source: require('../../assets/products/ecoza/technical_1.png') },
  ],
};
```

4. Reload the app — images appear automatically.

## Notes
- Header images are clipped to a circle (80x80px), so use square images
- Technical images render full-width with `contain` mode
- Both `require()` (local) and URL strings are supported
- Products without images continue showing the default icon
