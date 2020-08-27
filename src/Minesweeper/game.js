import Land from './land'
const COMPLEXITY = 12
// const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis))

class Game {
  constructor(vw, vh, offsetLeft, offsetTop, canvas) {
    this.land = new Land(vw, vh, offsetLeft, offsetTop)
    this.canvas = canvas
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.vw = canvas.width
    this.vh = canvas.width

    this.start = this.start.bind(this)
    this.loop = this.loop.bind(this)
    this.click = this.click.bind(this)
    this.resize = this.resize.bind(this)

    this.i = 0
  }

  start() {
    this.loop()
  }

  loop() {
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
        ctx.fillRect(field.posX, field.posY, field.posX + this.land.sideWidth + 5, field.posY + this.land.sideWidth + 5); // +5 do not work (gap bug)

        if (field.open && field.mine) { }

        if (!field.open) {
          field.value = field.flag ? 'F' : '' // field.mine ? 'm' : 'e'
        }
        ctx.fillStyle = field.valueColor

        ctx.font = `${this.land.sideWidth / 2}px serif`;
        let textOffset = ctx.measureText(`${field.value}`).width / 2
        ctx.fillText(field.value, field.posX + this.land.sideWidth / 2 - textOffset, field.posY + this.land.sideWidth / 2 - textOffset)
      }
    }

    if (this.startTime) {
      this.timer = Math.round((new Date() - this.startTime) / 1000)
      // ctx.font = `${this.vw / 14}px serif`;
      // ctx.fillText(this.timer + 's', 20, this.vh - 40)
    }
  }

  click(touch, flag) {
    const x = touch.pageX - this.offsetLeft
    const y = touch.pageY - this.offsetTop
    if (!this.startTime) this.startTime = new Date()

    this.land.click(x, y, flag)
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
