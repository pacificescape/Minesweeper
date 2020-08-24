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

  let main, touch, touchTime = 0, score, offsetLeft = 0, offsetTop = 0, canvas, minesweeper

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

  function handleStart (evt) {
    touch = evt.changedTouches ? evt.changedTouches[0] : evt
    touchTime = new Date()
    evt.preventDefault()

    // console.log("touchstart.")
  }

  function handleEnd (evt) {
    const ms = new Date() - touchTime
    evt = touch ? touch : evt

    if (ms <= FLAGDELAY) {
      minesweeper.click(evt)
    } else {
      minesweeper.click(evt, true)
    }
  }

  function handleCancel () {
    touch = null
  }

  function handleMove () {

  }

	onMount(() => {
    offsetLeft = canvas.offsetLeft + canvas.clientLeft
    offsetTop  = canvas.offsetTop  + canvas.clientTop

    minesweeper = new Game(vw, vh, offsetLeft, offsetTop, canvas)
    window.oncontextmenu = (evt) => evt
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);

    canvas.addEventListener('mousedown', handleStart)
    canvas.addEventListener('mouseup', handleEnd)

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
