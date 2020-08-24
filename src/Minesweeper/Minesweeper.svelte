<script>
  //  Заметки:
  //  нарисовать svg иконки флажка бомбы и тд
  //
  //  баг - клики не работают
  //  vh не используется!!!
  //

  import { onMount } from 'svelte';
  import Game from './game'

  const COMPLEXITY = 12
  const FLAGDELAY = 200

  let main, touch, score, offsetLeft = 0, offsetTop = 0, canvas, minesweeper

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

  function onTouch (evt) {
    touch = new Date()
  }

  function onTouchEnd (evt) {
    const ms = new Date() - touch

    if (ms <= FLAGDELAY) {
      minesweeper.click(evt)
    } else {
      minesweeper.click(evt, true)
    }
  }

  function onTouchCancel () {
    touch = null
  }

	onMount(() => {
    offsetLeft = canvas.offsetLeft + canvas.clientLeft
    offsetTop  = canvas.offsetTop  + canvas.clientTop

    minesweeper = new Game(vw, vh, offsetLeft, offsetTop, canvas)

    canvas.addEventListener('mousedown', onTouch)
    canvas.addEventListener('mouseup', onTouchEnd)
    canvas.addEventListener('ontouchstart', onTouch)
    canvas.addEventListener('ontouchmove', onTouchCancel)
    canvas.addEventListener('ontouchend', onTouchEnd)

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
  >CANVAS NOT DISPLAYED</canvas>
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
