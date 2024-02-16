import type { CamelCase } from 'type-fest';

export type KeySchemaToKeyMap<KeySchema extends Record<string, any>> =
	{ toString(): string } & {
		[K in keyof KeySchema as K extends `[${string}]`
			? never
			: CamelCase<K>]: KeySchema[K] extends boolean
			? K
			: KeySchemaToKeyMap<KeySchema[K]>;
	} & (keyof KeySchema & `[${string}]` extends never
			? keyof KeySchema & `{${string}}` extends never
				? {}
				: keyof KeySchema & `{${string}}` extends `{${infer K}}`
				? (id: string) => KeySchemaToKeyMap<KeySchema[`{${K}}`]>
				: never
			: keyof KeySchema & `[${string}]` extends `[${infer K}]`
			? (id: string) => KeySchemaToKeyMap<KeySchema[`[${K}]`]>
			: never);
