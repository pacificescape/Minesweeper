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

  let main, touch, touchTime = 0, timer, timerInterval, score, canvas, minesweeper
  let offsetLeft = 0
  let clientLeft = 0
  let offsetTop = 0
  let clientTop = 0

  let vw = Math.round(Math.max(document.documentElement.clientWidth  || 0, window.innerWidth  || 0))
  let vh = Math.round(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
  vw = vw > 600 ? 600 : vw

  // $: offsetLeft = ''
  $: offsetTop  = minesweeper ? minesweeper.resize(vw, vh, offsetLeft, offsetTop) : 0

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
    let flag = null
    const ms = new Date() - touchTime
    touch = touch ? touch : evt.changedTouches[0]

    if (!touch) return

    if (ms >= FLAGDELAY) flag = true
    if (touch.which === 3) flag = true

    minesweeper.click(touch, flag)
  }

  function handleMove (evt) {
    evt.preventDefault()
    // touch = null
  }

  function handleCancel () {
    touch = null
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

    timerInterval = setInterval(() => {
      timer = minesweeper.startTime ? Math.ceil((new Date() - minesweeper.startTime) / 1000) : ''
    }, 1000)

    minesweeper.start()
  })
</script>

<div class='main' bind:this={main}>
  <div class='head' bind:this={score}>
    <div class='timer'>
      {timer ? timer + 's' : ''}
    </div>
    <div class='score'>
      {timer ? timer + 's' : ''}
    </div>
    <div class='gameName'>
      Minesweeper
    </div>
    <div class='userName'>
      userName
    </div>
    <div class='ava'>
      {timer ? timer + 's' : ''}
    </div>
  </div>
  <div class="wrap"></div>
  <canvas
    oncontextmenu="return false;"
    bind:this={canvas}
    width={vw}
    height={vw}
  >CANVAS NOT SUPPORTED</canvas>
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

  .head {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .head div {
    width: 20%;
  }

  .timer {
    display: inline;

  }

</style>
