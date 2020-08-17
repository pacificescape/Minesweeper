<script>
	import { onMount } from 'svelte';

	let canvas

	onMount(() => {
    (function loop() {

      const ctx = canvas.getContext('2d')
      function draw() {
        let pen
        for (let line = 0; line < 8; line++) {
          for (let col = 0; col < 8; col++) {
            if (canvas.getContext) {
              const posX = 15 + line * 60
              const posY = 15 + col * 60

              ctx.moveTo(posX, posY);
              ctx.lineTo(posX + 55, posY);
              ctx.lineTo(posX + 55, posY + 50);

              ctx.lineTo(posX, posY + 50);
              ctx.lineTo(posX, posY);

              ctx.stroke()
              ctx.fillStyle = "rgb(222,222,222)";
              ctx.fillRect (posX, posY, 55, 50);

              // ctx.fillStyle = "rgba(44, 222, 111, 0.5)";
              // ctx.strokeRect (15 + line * 60, 15 + col * 60, 55, 50);
            }
          }
        }
      }
      draw()
      ctx.putImageData(imageData, 0, 0);
    })()
	})
</script>

<canvas
	bind:this={canvas}
	width={500}
	height={500}
></canvas>

<style>
	canvas {
        margin: 200px;
		background-color: #666;
	}
</style>
