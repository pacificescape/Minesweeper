<script>
  import { onMount } from 'svelte';

  let elemLeft = 0
  let elemTop = 0

	let canvas
  const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis))

  let vw = Math.max(document.documentElement.clientWidth  || 0, window.innerWidth  || 0)
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  window.addEventListener('resize', () => {
    vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    console.log('vw', vw)
    console.log('vh', vh)

    elemLeft = canvas.offsetLeft + canvas.clientLeft
    elemTop  = canvas.offsetTop  + canvas.clientTop

    // for (let [row, line] of lands.entries()) {
    //     line.forEach((land, col) => {
    //       lands[line][row].posX = vw * 0.11 + line * vw * 0.1
    //       lands[line][row].posY = vw * 0.11 + col * vw * 0.1
    //     })}
  })

  console.log('vw', vw)
  console.log('vh', vh)

  const lands = []

  for (let l = 0; l < 64; l++) {
    const line = Math.floor(l/8)
    const col = l % 8

    lands[line] = lands[line] || []

    lands[line].push(
      {
        color: "rgba(77,155,77,1)",
        posX: vw * 0.11 + line * vw * 0.1,
        posY: vw * 0.11 + col * vw * 0.1,
        state: false
      }
    )
  }

	onMount(() => {
    elemLeft = canvas.offsetLeft + canvas.clientLeft
    elemTop  = canvas.offsetTop  + canvas.clientTop

    canvas.addEventListener('click', (evt) => {
      click(evt)
      cancelAnimationFrame(loop);
    })
    requestAnimationFrame(loop)
  })

  function loop() {
      requestAnimationFrame(loop);
      const ms = new Date()
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0,0,vw,vh)

      for (let [row, line] of lands.entries()) {
        line.forEach((land, col) => {
          if(land.state) return
          if (canvas.getContext) {
                land.posY = vw * 0.05 + row  * vw * 0.1 + Math.ceil(row/8) * 6 * row // отступы
                land.posX = vw * 0.05 + col  * vw * 0.1 + Math.ceil(col/8) * 6 * col

                ctx.beginPath()
                ctx.lineCap = "round"
                ctx.lineWidth = 2;

                ctx.moveTo(land.posX, land.posY);
                ctx.strokeStyle = `rgb(${Math.floor(255-32.5*row)},${Math.floor(255-34.5*col)},102)`;
                ctx.lineTo(land.posX + vw * 0.1, land.posY);
                ctx.lineTo(land.posX + vw * 0.1, land.posY + vw * 0.1);
                ctx.stroke()
                ctx.closePath()

                ctx.beginPath()
                ctx.lineCap = "round"
                ctx.lineWidth = 2;
                ctx.moveTo(land.posX + vw * 0.1, land.posY + vw * 0.1);
                ctx.strokeStyle = `rgb(${Math.floor(255-20*line)},${Math.floor(255-20*col)},122)`;

                ctx.lineTo(land.posX, land.posY + vw * 0.1);
                ctx.lineTo(land.posX, land.posY);
                ctx.stroke()
                ctx.closePath()

                ctx.fillStyle = land.color;
                ctx.fillRect (land.posX, land.posY, vw * 0.1, vw * 0.1);
            }
        })
      }

      ctx.fillStyle = "#ccc";
      ctx.font = "50px serif";
      let date = new Date()
      let text = date.getHours() + ':' + date.getMinutes()+ ':' + date.getMilliseconds() + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
      let width = ctx.measureText(text).width
      ctx.fillText(text, 250 - width / 2, 50);

      ctx.font = "20px serif";
      ctx.fillText(new Date() - ms + 'ms', 20, 480)
  }

  function click (event) {
    let x = event.pageX,
        y = event.pageY - elemTop

    for (let [row, line] of lands.entries()) {
    const target = line.map((land, col) => {
      const posY = lands[col][row].posY
      const posX = lands[col][row].posX
      let xx = true
      let yy= true

      if (x >= posX && x <= posX + vw * 0.1) {
      console.log(posX)
      console.log(x)
        xx = false
      };
      // debugger
      if (y >= posY && y <= posY + vw * 0.1) {
        console.log(posY)
        console.log(y)
        yy = false
      };

      debugger
      if (!xx && !yy) {
          lands[col][row].state = true
          console.log([row, col])
          console.log([y, x])
      }
    })
  }

  }
</script>

<canvas
	bind:this={canvas}
	width={vw}
	height={500}
></canvas>

<style>
	canvas {
    margin: 30px 0;
		background-color: #666;
	}
</style>
