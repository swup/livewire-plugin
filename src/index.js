import Plugin from '@swup/plugin';

export default class SwupLivewirePlugin extends Plugin {
	name = 'SwupLivewirePlugin';

	requires = { swup: '>=4' };

	livewireComponents = [];

	get url() {
		return window.location.pathname + window.location.search;
	}

	constructor() {
		super();

		if (typeof window.Livewire === 'undefined') {
			throw 'window.Livewire is undefined. Make sure to include @livewireScripts before this script';
		}
	}

	mount() {
		this.swup.hooks.before('replaceContent', this.cacheLivewireComponents);
		this.swup.hooks.on('replaceContent', this.refreshLivewireComponents);
	}

	unmount() {
		this.swup.hooks.off('replaceContent', this.cacheLivewireComponents);
		this.swup.hooks.off('replaceContent', this.refreshLivewireComponents);
	}

	cacheLivewireComponents = () => {
		// Save Livewire components to refresh later
		const components = Array.from(document.querySelectorAll('[wire\\:id]'));
		this.livewireComponents[this.url] = components;

		// Pages with Livewire components should not be cached
		if (components.length) {
			this.swup.cache.delete(this.url);
		}
	}

	refreshLivewireComponents = () => {
		// Refresh any previously saved Livewire Components
		const components = this.livewireComponents[this.url] || [];
		components.forEach((el) => {
			const component = el.__livewire;
			const { effects, fingerprint, serverMemo } = component;
			const data = { effects, fingerprint, serverMemo };
			el.setAttribute('wire:initial-data', JSON.stringify(data));
		});

		// Aleays restart Livewire
		window.Livewire.restart();
	}
}
