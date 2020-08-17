import App from './App.svelte'
import { version } from '../package.json'

const app = new App({
	target: document.body,
	props: {
		version
	}
});

export default app
