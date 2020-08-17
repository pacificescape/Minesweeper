<script>
  let date = Date()
  const date2 = Date()
  setInterval(() => date = Date(), 500)
</script>

<main>
  <div>
    <h3>Time is {date}</h3>
    <h3>date2 is {date2}</h3>
  </div>
</main>

<style>
	main {
		text-align: center;
		/* padding: 1em; */
		width: 100%;
    background-color: #3a3a3a;
    padding: 0;
		margin: 0 auto;
	}

	h3 {
		color: #004c8a;
		text-transform: uppercase;
		font-size: 1em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
