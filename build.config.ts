import { defineBuildConfig } from 'unbuild';
import { join } from 'desm';

export default defineBuildConfig({
	alias: {
		'~': join(import.meta.url, 'src')
	}
});
