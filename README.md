# Swup Livewire Plugin

A [swup](https://swup.js.org) plugin for integrating [Laravel Livewire](https://laravel-livewire.com/).

Re-initialize Livewire components after each page change.

## Installation

Install the plugin from npm and import it into your bundle.

```bash
npm install @swup/livewire-plugin
```

```js
import SwupLivewirePlugin from '@swup/livewire-plugin';
```

Or include the minified production file from a CDN:

```html
<script src="https://unpkg.com/@swup/livewire-plugin@2"></script>
```

## Usage

To run this plugin, include an instance in the swup options.

```javascript
const swup = new Swup({
  plugins: [new SwupLivewirePlugin()]
});
```
