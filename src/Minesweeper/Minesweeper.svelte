<script>
  //  Заметки:
  //  нарисовать svg иконки флажка бомбы и тд
  //
  //  баг - не весь квадратик кликается
  //
  //

  import { onMount } from 'svelte';
  import Game from './game'

  const COMPLEXITY = 8
  let main, score, offsetLeft = 0, offsetTop = 0, canvas, minesweeper
  const ms = new Date()

  let vw = Math.round(Math.max(document.documentElement.clientWidth  || 0, window.innerWidth  || 0))
  let vh = Math.round(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
  vw = vw > 600 ? 600 : vw

  window.addEventListener('resize', () => {
    vw = Math.round(Math.max(main.offsetWidth || 0, window.innerWidth || 0))
    vh = Math.round(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    vw = vw > 600 ? 600 : vw

    console.log('resize: (', vw, vh, ')')

    offsetLeft = Math.round(canvas.offsetLeft + canvas.clientLeft)
    offsetTop  = Math.round(canvas.offsetTop  + canvas.clientTop)

    minesweeper.resize(vw, vh, offsetLeft, offsetTop)
  })

	onMount(() => {
    offsetLeft = canvas.offsetLeft + canvas.clientLeft
    offsetTop  = canvas.offsetTop  + canvas.clientTop

    minesweeper = new Game(vw, vh, offsetLeft, offsetTop, canvas)

    canvas.addEventListener('click', minesweeper.click)

    minesweeper.start()
  })
</script>

<div class='main' bind:this={main}>
  <div class='score' bind:this={score}>
    Score
  </div>
  <canvas
    bind:this={canvas}
    width={vw}
    height={vw}
  ></canvas>
</div>

<style>
	canvas {
    margin: 30px 0;
		background-color: rgb(22, 22, 22);
  }

  .main {
    margin: auto;
    max-width: 600px;
  }
</style>
