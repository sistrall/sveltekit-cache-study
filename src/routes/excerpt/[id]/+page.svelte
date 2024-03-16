<script lang="ts">
	export let data;

	const { lyricExcerpt, surrogateKeys } = data;
</script>

<div class="mx-auto container prose lg:prose-xl">
	<main>
		<p>
			<a href="/">🔙 Go back to home</a>
		</p>
		<h1>{lyricExcerpt.songTitle}</h1>
		<blockquote>{@html lyricExcerpt.text}</blockquote>
		<p>— Updated at {lyricExcerpt.updatedAt}</p>
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
