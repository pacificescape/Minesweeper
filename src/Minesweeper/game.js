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
    this.vh = canvas.width

    this.click = this.click.bind(this)
    this.resize = this.resize.bind(this)
  }

  start() {
    this.loop()
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

        ctx.fillStyle = field.color
        ctx.fillRect(field.posX, field.posY, field.posX + this.land.sideWidth, field.posY + this.land.sideWidth,);

        if (field.open && field.mine) { }

        if (field.open) {
          ctx.fillStyle = field.valueColor

          ctx.font = `${this.land.sideWidth / 2}px serif`;
          let textOffset = ctx.measureText(`${field.value}`).width / 2
          ctx.fillText(field.value, field.posX + this.land.sideWidth / 2 - textOffset, field.posY + this.land.sideWidth / 2 - textOffset)
        }
      }
    }

    // timers

    // ctx.fillStyle = "#ccc";
    // ctx.font = `${this.vw / 14}px sans`;
    // let date = new Date()
    // let text = date.getHours() + ':' + date.getMinutes() + ':' + date.getMilliseconds() + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    // let width = ctx.measureText(text).width
    // ctx.fillText(text, (this.vw - width) / 2, this.vh - 40);

    ctx.font = `${this.vw / 14}px serif`;
    ctx.fillText(Math.round((new Date() - ms) / 1000) + 's', 20, this.vh - 40)
  }

  click(event) {
    const x = event.pageX - this.offsetLeft
    const y = event.pageY - this.offsetTop

    this.land.click(x, y)
  }

  resize(vw, vh, offsetLeft, offsetTop) {
    cancelAnimationFrame(this.loop)
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.vw = vw
    this.vh = vw

    this.land.resize(this.vw, this.vh, this.offsetLeft, this.offsetTop) // width of canvas or vp?
    requestAnimationFrame(this.loop)
  }
}

export default Game
