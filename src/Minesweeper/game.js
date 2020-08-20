import Land from './land'
const COMPLEXITY = 8
let elemLeft = 0
let elemTop = 0
const ms = new Date()
const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis))

class Game {
  constructor(vw, vh, offsetLeft, offsetTop, canvas) {
    this.land = new Land(vw, vh, offsetLeft, offsetTop)
    this.canvas = canvas
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.vw = canvas.width
    this.vh = canvas.height

    this.click = this.click.bind(this)
    this.resize = this.resize.bind(this)
  }

  start() {
    requestAnimationFrame(this.loop)
    const ctx = this.canvas.getContext('2d')

    ctx.fillStyle = "#fff";
    ctx.font = `111px serif`;
    ctx.fillText('started', 20, 100)
  }

  loop = () => {
    requestAnimationFrame(this.loop);
    if (!this.canvas.getContext) return

    // clear canvas

    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.vw, this.vh)

    // render land (field/cell)

    for (let row = 0; row < COMPLEXITY; row++) {
      for (let col = 0; col < COMPLEXITY; col++) {
        const field = this.land.get(row, col)

        ctx.fillRect(field.posX, field.posY, field.posX + this.land.sideWidth, field.posY + this.land.sideWidth,);

        if (field.open && field.mine) { }

        if (field.open) {
          ctx.fillStyle = field.color

          ctx.font = `${field.sideWidth / 2}px serif`;
          let textOffset = ctx.measureText(field.value) / 2
          ctx.fillText(field.value, field.posX + field.sideWidth / 2 - textOffset, field.posY + field.sideWidth / 2 - textOffset)
        }
      }
    }

    // timers

    ctx.fillStyle = "#ccc";
    ctx.font = `${this.vw / 14}px sans`;
    let date = new Date()
    let text = date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds() + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    let width = ctx.measureText(text).width
    ctx.fillText(text, (this.vw - width) / 2, this.vh - 40);

    ctx.font = `${this.vw / 14}px serif`;
    ctx.fillText(Math.round((new Date() - ms) / 1000) + 's', 20, this.vh - 40)
  }

  click(event) {
    const x = event.pageX - this.elemLeft
    const y = event.pageY - this.elemTop

    this.land.click(x, y)
  }

  resize(vw, vh, offsetLeft, offsetTop) {
    this.land.resize(vw, vh, offsetLeft, offsetTop) // width of canvas or vp?
  }
}

export default Game
