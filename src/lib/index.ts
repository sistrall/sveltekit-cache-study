import { createClient } from '@vercel/kv';

import {
	DATOCMS_READONLY_API_TOKEN,
	REDIS_REST_API_URL,
	REDIS_REST_API_TOKEN
} from '$env/static/private';

export const BYPASS_TOKEN_FOR_INVALIDATION = 'BYPASS_TOKEN_FOR_INVALIDATION';

export async function getData({
	query,
	variables = {},
	includeDrafts = false
}: {
	query: string;
	variables?: any;
	includeDrafts?: boolean;
}) {
	const response = await fetch('https://graphql.datocms.com/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'X-Exclude-Invalid': 'true',
			'Fastly-Debug': '1',
			Authorization: `Bearer ${DATOCMS_READONLY_API_TOKEN}`,
			...(includeDrafts ? { 'X-Include-Drafts': 'true' } : {})
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch data: ${JSON.stringify(response)}`);
	}

	const { data } = await response.json();
	const surrogateKeys = response.headers.get('surrogate-key')?.split(' ') || [];

	return { data, surrogateKeys };
}

function kvClient() {
	return createClient({
		url: REDIS_REST_API_URL!,
		token: REDIS_REST_API_TOKEN!
	});
}

export async function storeSurrogateKeys({
	path,
	surrogateKeys
}: {
	path: string;
	surrogateKeys: string[];
}) {
	const kv = kvClient();

	for (const surrogateKey of surrogateKeys) {
		await kv.sadd(surrogateKey, path);
	}
}

export async function invalidateSurrogateKeys({
	surrogateKeys,
	url
}: {
	surrogateKeys: string[];
	url: string;
}) {
	const kv = kvClient();

	const pathsToBeRevalidated = (
		await Promise.all(
			surrogateKeys.map(async (surrogateKey) => {
				try {
					const paths = await kv.smembers(surrogateKey);

					await kv.del(surrogateKey);

					return paths;
				} catch (error) {
					return [];
				}
			})
		)
	)
		.flat()
		.filter((value, index, array) => array.indexOf(value) === index);

	for (const path of pathsToBeRevalidated) {
		invalidatePath({ path, url });
	}

	return pathsToBeRevalidated;
}

async function invalidatePath({ path, url }) {
	const baseUrl = new URL(path, url).href;

	fetch(baseUrl, {
		headers: {
			'x-prerender-revalidate': BYPASS_TOKEN_FOR_INVALIDATION
		}
	});
}
