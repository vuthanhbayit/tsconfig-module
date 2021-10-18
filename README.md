###A module auto build tsconfig.json for nuxt module support for multi app.
Example: https://github.com/vuthanhbayit/nuxt-multi-app

## 🚀 Quick Start

Install:

```bash
# yarn
yarn add --dev @vt7/tsconfig-module
```

## Use

```nuxt.config.ts
"buildModules": [
  ...
  '@vt7/tsconfig-module'
],

tsConfig: {
  compilerOptions: {
    types: ['@nuxtjs/sentry'],
  },
  exclude: ['app/mobile'],
},
```
