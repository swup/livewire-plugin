import Plugin from '@swup/plugin';

export default class SwupLivewirePlugin extends Plugin {
	name = 'SwupLivewirePlugin';

	constructor() {
		super();

		if (typeof window.Livewire === 'undefined') {
			throw 'window.Livewire is undefined. Make sure to include @livewireScripts before this script';
		}

		this.livewireComponents = [];
	}

	mount() {
		this.swup.on('clickLink', () => this.cacheLivewireComponents());
		this.swup.on('contentReplaced', () => this.refreshLivewireComponents());
	}

	unmount() {
		// this is executed when swup with plugin is disabled
		// you can use this.swup here to access swup instance
	}

	cacheLivewireComponents() {
		// Save Livewire components to refresh later
		this.livewireComponents[window.location.pathname] = document.querySelectorAll(
			'[wire\\:id]'
		);

		// Pages with Livewire components should not be cached
		if (this.livewireComponents[window.location.pathname].length) {
			this.swup.cache.remove(window.location.pathname);
		}
	}

	refreshLivewireComponents() {
		// Refresh any previously saved Livewire Components
		if (this.livewireComponents[window.location.pathname]) {
			this.livewireComponents[window.location.pathname].forEach(function(el) {
				const component = el.__livewire;
				const dataObject = {
					fingerprint: component.fingerprint,
					serverMemo: component.serverMemo,
					effects: component.effects
				};
				el.setAttribute('wire:initial-data', JSON.stringify(dataObject));
			});
		}

		// Aleays restart Livewire
		window.Livewire.restart();
	}
}
