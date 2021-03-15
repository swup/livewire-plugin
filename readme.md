# Swup Livewire Plugin

This [swup](https://swup.js.org/) plugin adds support for [Laravel Livewire](https://laravel-livewire.com/)

## Instalation

This plugin can be installed with npm

```bash
npm install swup-livewire-plugin
```

and included with import

```javascript
import SwupLivewirePlugin from 'swup-livewire-plugin';
```

or included from the dist folder

```html
<script src="./dist/SwupNamePlugin.js"></script>
```

## Usage

To run this plugin, include an instance in the swup options.

```javascript
const swup = new Swup({
  plugins: [new SwupLivewirePlugin()]
});
```
