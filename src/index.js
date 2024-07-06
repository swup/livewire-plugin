import Plugin from '@swup/plugin';

export default class SwupLivewirePlugin extends Plugin {
	name = 'SwupLivewirePlugin';

	requires = { swup: '>=4' };

	livewireComponents = [];

	get url() {
		return window.location.pathname + window.location.search;
	}

	mount() {
		if (typeof window.Livewire === 'undefined') {
			throw new Error(
				'window.Livewire is undefined. Make sure to include @livewireScripts before this script.'
			);
		}

		this.before('content:replace', this.cacheLivewireComponents);
		this.on('content:replace', this.refreshLivewireComponents);
	}

	cacheLivewireComponents() {
		// Save Livewire components to refresh later
		const components = Array.from(document.querySelectorAll('[wire\\:id]'));
		this.livewireComponents[this.url] = components;

		// Pages with Livewire components should not be cached
		if (components.length) {
			this.swup.cache.delete(this.url);
		}
	}

	refreshLivewireComponents() {
		// Refresh any previously saved Livewire Components
		const components = this.livewireComponents[this.url] || [];
		components.forEach((el) => {
			const component = el.__livewire;
			const { effects, fingerprint, serverMemo } = component;
			const data = { effects, fingerprint, serverMemo };
			el.setAttribute('wire:initial-data', JSON.stringify(data));
		});

		// Always restart Livewire
		if (typeof window.Livewire.restart === 'function') {
			window.Livewire.restart();
		} else {
			// handle versions of Livewire that don't have the .restart() method
			window.Livewire.all().map((component) => {
				// not always defined - depends on the component
				if (typeof component.call === 'function') {
					return component.call('restart');
				}
				// alternative version to component.call('restart') in case that doesn't exist
				if (typeof component.$wire?.$refresh === 'function') {
					component.$wire.$refresh();
				}
			});
		}
	}
}
