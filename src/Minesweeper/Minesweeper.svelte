<script>
  import { onMount } from 'svelte';

  let elemLeft = 0
  let elemTop = 0
  const ms = new Date()
	let canvas
  const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis))

  let vw = even(Math.max(document.documentElement.clientWidth  || 0, window.innerWidth  || 0))
  let vh = even(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))

  let vwd = even(vw * 0.1)

  window.addEventListener('resize', () => {
    vw = even(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
    vh = even(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    vwd = even(vw * 0.1)
    console.log('vw', vw)
    console.log('vh', vh)

    elemLeft = even(canvas.offsetLeft + canvas.clientLeft)
    elemTop  = even(canvas.offsetTop  + canvas.clientTop)

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
        posX: even(vw * 0.11 + line * vwd),
        posY: even(vw * 0.11 + col  * vwd),
        open: false,
        mine: Math.random() > 0.8 ? true : false,
        value: ''
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
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0,0,vw,vh)

      for (let [row, line] of lands.entries()) {
        line.forEach((land, col) => {
          land.posY = even(vw * 0.05 + row  * vwd + Math.ceil(row/8) * 6 * row) // отступы
          land.posX = even(vw * 0.05 + col  * vwd + Math.ceil(col/8) * 6 * col)
          if (!canvas.getContext) return
          ctx.beginPath()
          ctx.lineCap = "square"
          ctx.lineWidth = 8;

          ctx.moveTo(land.posX, land.posY);
          ctx.strokeStyle = `rgb(${Math.floor(255-32.5*row)},${Math.floor(255-34.5*col)},102)`;
          ctx.lineTo(even(land.posX + vwd), even(land.posY));
          ctx.lineTo(even(land.posX + vwd), even(land.posY + vwd));
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath()
          ctx.lineCap = "square"
          ctx.lineWidth = 8;
          ctx.moveTo(land.posX + vwd, land.posY + vwd);
          ctx.strokeStyle = `rgb(${Math.floor(255-20*line)},${Math.floor(255-20*col)},122)`;

          ctx.lineTo(land.posX, land.posY + vwd);
          ctx.lineTo(land.posX, land.posY);
          ctx.stroke()
          ctx.closePath()

          ctx.fillStyle = land.color;
          ctx.fillRect(even(land.posX), even(land.posY), even(vwd) , even(vwd));
          if(land.open && land.mine) {
          }

          if(land.open) {
            ctx.fillStyle = land.value === 0 ? '#fff' : land.value === '*' ? '#000' : 'rgb(77, 255, 77)'

            ctx.font = "30px serif";
            ctx.fillText(land.value, even(land.posX) + even(vwd) / 2, even(land.posY) + even(vwd) / 2)
          }
        })
      }

      ctx.fillStyle = "#ccc";
      ctx.font = "10px serif";
      let date = new Date()
      let text = date.getHours() + ':' + date.getMinutes()+ ':' + date.getMilliseconds() + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
      let width = ctx.measureText(text).width
      ctx.fillText(text, (vw - width)/ 2, vh - 40);

      ctx.font = "10px serif";
      ctx.fillText(Math.round((new Date() - ms) / 1000) + 's', 20, vh - 40)
  }

  function click (event) {
    let x = event.pageX,
        y = event.pageY - elemTop

    for (let [col, line] of lands.entries()) {
    const target = line.map((land, row) => {
      const posY = lands[row][col].posY
      const posX = lands[row][col].posX
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

      // debugger
      if (!xx && !yy) {
        open(row, col)
      }
    })
  }
  }

  function open (row, col) {
    if (lands[row][col].open) return
    lands[row][col].open = true
          lands[row][col].color = '#8a8a8a'
          if (lands[row][col].mine) return lands[row][col].value = '*'

          let value = 0
          try {
            for (let r = -1; r < 2; r++) {
              for (let c = -1; c < 2; c++) {
                if (lands[row + r] && lands[row + r][col + c] && lands[row + r][col + c].mine) value += 1
              }
            }
          } catch (err) {
            console.log(err)
          }

          lands[row][col].value = value

          if (value === 0) {
            for (let r = -1; r < 2; r++) {
              for (let c = -1; c < 2; c++) {
                if (c === 0 && r === 0) continue
                if (row + r < 0 || row + r > 7) continue
                if (col + c < 0 || col + c > 7) continue
                open(row + r, col + c)
              }
            }
          }
  }

  function even (number) {
    number = Math.round(number)
    if (number % 2 !== 0) return number + 1
    return number
  }


</script>

<canvas
	bind:this={canvas}
	width={vw}
	height={vh}
></canvas>

<style>
	canvas {
    margin: 30px 0;
		background-color: rgb(22, 22, 22);
	}
</style>
