const COMPLEXITY = 12
const colors = {
  1: '#1b76d1',
  2: '#3a8e3c',
  3: '#d32f2f',
  4: '#7c21a1',
  5: '#f4c20d',
  6: '#ed44b5',
  7: '#48e6f1',
  8: '#f4840d'
}
// ctx.fillStyle = land.color ? land.color : (row + col) % 2 === 1 ? '#a7d948' : '#8ecc39'

class Land {
  constructor(width, height, offsetLeft, offsetTop) {
    this.land = []
    this.generated = false
    this.gameOver = false
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.sideWidth = Math.round(width / COMPLEXITY)

    this.generate()

    this.get= this.get.bind(this)
    this.open = this.open.bind(this)
    this.click= this.click.bind(this)
    this.resize = this.resize.bind(this)
    this.generate = this.generate.bind(this)
    this.toGameOver = this.toGameOver.bind(this)
  }

  generate () {
    for (let row = 0; row < COMPLEXITY; row++) {
      for (let col = 0; col < COMPLEXITY; col++) {
        this.land[row] = this.land[row] || []

        this.land[row][col] = {
          color: (row + col) % 2 === 1 ? '#a7d948' : '#8ecc39',
          valueColor: '#f4840d',
          posX: Math.round(col * this.sideWidth),
          posY: Math.round(row * this.sideWidth),
          open: false,
          mine: Math.random() > 0.7 ? true : false,
          value: ''
        }
      }
    }
  }

  sanitaze (col, row) {
    for (let r = -1; r < 2; r++) {
      for (let c = -1; c < 2; c++) {
        if (this.land[row + r]) {
          if (this.land[row + r][col + c]) {
            console.log(row + r, col + c, this.land[row + r][col + c].mine)
            this.land[row + r][col + c].mine = false
            console.log(row + r, col + c, this.land[row + r][col + c].mine)
          }
        }
      }
    }
    this.generated = true
  }

  get (row, col) {
    return this.land[row][col]
  }

  resize(width, height, offsetLeft, offsetTop) {
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.sideWidth = Math.round(width / COMPLEXITY)

    for (let row = 0; row < COMPLEXITY; row++) {
      for (let col = 0; col < COMPLEXITY; col++) {
        this.land[row] = this.land[row] || []

        this.land[row][col].posX = Math.round(col * width / COMPLEXITY)
        this.land[row][col].posY = Math.round(row * height / COMPLEXITY)
      }
    }
  }

  click(x, y) {
    if (this.gameOver) return

    let targetCol
    let targetRow

    for (let col = 0; col < COMPLEXITY; col++) {
      if (x > Math.round(col * this.sideWidth)) {
        if (x <= Math.round((col + 1) * this.sideWidth)) {
          targetCol = col
          break
        }
      }
    }

    for (let row = 0; row < COMPLEXITY; row++) {
      if (y > Math.round(row * this.sideWidth)) {
        if (y <= Math.round((row + 1) * this.sideWidth)) {
          targetRow = row
          break
        }
      }
    }

    if (!this.generated) this.sanitaze(targetCol, targetRow)

    if (!(targetCol >= 0) || !(targetRow >= 0)) { // target is null or 0-7
      console.log('targetX, targetY error')
      return
    }

    this.open(targetCol, targetRow)
  }

  open (col, row) {
    const field = this.land[row][col]

    if (field.open) return
    field.open = true
    field.color = (row + col) % 2 === 1 ? '#8a8a8a' : '#868686'

    if (field.mine) {
      field.value = '*'
      field.color = 'rgb(233, 66, 89)'
      this.toGameOver(field)
      return
    }

    let value = 0
    try {
      for (let r = -1; r < 2; r++) {
        for (let c = -1; c < 2; c++) {
          if (this.land[row + r] && this.land[row + r][col + c] && this.land[row + r][col + c].mine) value += 1
        }
      }
    } catch (err) {
      console.log(err)
    }

    field.value = value
    field.valueColor = colors[value]

    if (value === 0) {
      for (let r = -1; r < 2; r++) {
        for (let c = -1; c < 2; c++) {
          if (c === 0 && r === 0) continue
          if (row + r < 0 || row + r > COMPLEXITY - 1) continue
          if (col + c < 0 || col + c > COMPLEXITY - 1) continue
          this.open(col + c, row + r)
        }
      }
    }
  }

  toGameOver () {
    // this.gameOver = true
  }
}

export default Land
