<script lang="ts">
	export let data;

	const { allLyricExcerpts, surrogateKeys } = data;
</script>

<div class="mx-auto container prose lg:prose-xl">
	<main>
		<p>Pick any excerpt</p>
		<h1>Lyric excerpts</h1>
		<ul>
			{#each allLyricExcerpts as excerpt}
				<li>
					<a href={`/excerpt/${excerpt.id}`}>
						{excerpt.songTitle} • {excerpt.author}
					</a>
				</li>
			{/each}
		</ul>
	</main>
	<hr />
	<footer>
		<ul>
			<li>
				Surrogate keys: <code>{surrogateKeys.join(' ')}</code>
			</li>
			<li>Render at {new Date().toISOString()}</li>
		</ul>
	</footer>
</div>
