<script>
  import { onMount } from 'svelte';

	let canvas
  const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis))

	onMount(() => {
    setInterval(() => requestAnimationFrame(loop))
  })

  function loop() {
      const ms = new Date()
      const promises = []
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0,0,500,500)
      let pen
      for (let line = 0; line < 8; line++) {
        for (let col = 0; col < 8; col++) {
          if (canvas.getContext) {
                const posX = 15 + line * 60
                const posY = 15 + col * 60
                ctx.beginPath()
                ctx.lineCap = "round"
                ctx.lineWidth = 2;
                ctx.moveTo(posX, posY);
                ctx.strokeStyle = `rgb(${Math.floor(255-32.5*line)},${Math.floor(255-34.5*col)},102)`;
                ctx.lineTo(posX + 55, posY);
                ctx.lineTo(posX + 55, posY + 50);
                ctx.stroke()
                ctx.closePath()

                ctx.beginPath()
                ctx.lineCap = "round"
                ctx.lineWidth = 2;
                ctx.moveTo(posX + 55, posY + 50);
                ctx.strokeStyle = `rgb(${Math.floor(255-20*line)},${Math.floor(255-20*col)},122)`;
                ctx.lineTo(posX, posY + 50);
                ctx.lineTo(posX, posY);
                ctx.stroke()
                ctx.closePath()

                ctx.fillStyle = "rgba(77,155,77,1)";
                ctx.fillRect (posX, posY, 55, 50);
            }
          }
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
</script>

<canvas
	bind:this={canvas}
	width={500}
	height={500}
></canvas>

<style>
	canvas {
    margin: 30px 0;
		background-color: #666;
	}
</style>
