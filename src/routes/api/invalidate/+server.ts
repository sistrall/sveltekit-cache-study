import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidateSurrogateKeys } from '$lib';

export const POST: RequestHandler = async ({ request }) => {
  const url = request.url;
	const body = await request.text();
	const surrogateKeys = body.split(/[\s,]+/);

	const revalidatedPaths = await invalidateSurrogateKeys({ surrogateKeys, url });

	return json({ surrogateKeys, revalidatedPaths });
};
