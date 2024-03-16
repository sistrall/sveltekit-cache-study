import { BYPASS_TOKEN_FOR_INVALIDATION, getData, storeSurrogateKeys } from "$lib";

export const config = {
  isr: {
    expiration: false,
    bypassToken: BYPASS_TOKEN_FOR_INVALIDATION,
  },
};

/** @type {import('./$types').PageLoad} */
export async function load() {
  const { data, surrogateKeys } = await getData({
    query: `query Home {
    allLyricExcerpts {
      songTitle
      author
      id
    }
  }`
  });

  const { allLyricExcerpts } = data;
  
  await storeSurrogateKeys({ path: '/', surrogateKeys });

  return { allLyricExcerpts, surrogateKeys };
}