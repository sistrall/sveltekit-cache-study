import { BYPASS_TOKEN_FOR_INVALIDATION, getData, storeSurrogateKeys } from '$lib';

export const config = {
  isr: {
    expiration: false,
    bypassToken: BYPASS_TOKEN_FOR_INVALIDATION,
  },
};

/** @type {import('./$types').PageLoad} */
export async function load({ params: { id } }) {
	const { data, surrogateKeys } = await getData({
		query: `query Excerpt($id: ItemId) {
      lyricExcerpt(filter: {id: {eq: $id}}) {
        songTitle
        author
        id
        createdAt
        updatedAt
        text(markdown: true)
      }
    }`,
		variables: { id }
	});

	const { lyricExcerpt } = data;

	await storeSurrogateKeys({
		path: `/excerpt/${lyricExcerpt.id}`,
		surrogateKeys
	});

	return { lyricExcerpt, surrogateKeys };
}
