import { camelCase } from 'change-case';
import type { KeySchemaToKeyMap } from '~/types/key.js';

function createSubschemaValue({
	pathParts,
	subschema
}: {
	pathParts: string[];
	subschema: string | Record<string, any>;
}) {
	if (typeof subschema === 'string') {
		return pathParts.join(':') + subschema;
	}

	const dynamicKey = Object.keys(subschema).find(
		(key) => /\[.*]/.test(key) || /{.*}/.test(key)
	);

	const subschemaValue =
		dynamicKey === undefined
			? {}
			: (id: string) =>
					createSubschemaValue({
						pathParts: [...pathParts, /{.*}/.test(dynamicKey) ? `{${id}}` : id],
						subschema: subschema[dynamicKey]
					});

	for (const [key, value] of Object.entries(subschema)) {
		if (key === dynamicKey) continue;
		if (/\[.*]/.test(key) || /{.*}/.test(key)) {
			throw new Error('There can only be one dynamic key in a key subschema');
		}

		// @ts-expect-error: we want to be able to assign arbitrary properties
		subschemaValue[camelCase(key)] = createSubschemaValue({
			pathParts: [...pathParts, key],
			subschema: value
		});
	}

	return Object.assign(subschemaValue, {
		toString() {
			return pathParts.join(':');
		}
	});
}

export function defineKey<KeySchema extends Record<string, any>>(
	base: string,
	schema: KeySchema
): KeySchemaToKeyMap<KeySchema> {
	return createSubschemaValue({ subschema: schema, pathParts: [base] }) as any;
}
