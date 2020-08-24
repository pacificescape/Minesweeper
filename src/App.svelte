<script>
	import Header from './Header.svelte'
	import Minesweeper from './Minesweeper/Minesweeper.svelte'
</script>

<main>
	<!-- <Header></Header> -->
	<Minesweeper></Minesweeper>
</main>

<style>
	main {
		background-color: #2d2d2d;
		text-align: center;
		margin: 0 auto;
		-webkit-user-select: none;
		   -moz-user-select: none;
		    -ms-user-select: none;
		        user-select: none;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
