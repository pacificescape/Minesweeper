const COMPLEXITY = 8
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
    this.gameOver = false
    this.offsetLeft = offsetLeft
    this.offsetTop = offsetTop
    this.sideWidth = Math.round(width / COMPLEXITY)

    for (let row = 0; row < COMPLEXITY; row++) {
      for (let col = 0; col < COMPLEXITY; col++) {
        this.land[row] = this.land[row] || []

        this.land[row][col] = {
          color: (row + col) % 2 === 1 ? '#a7d948' : '#8ecc39',
          valueColor: '#f4840d',
          posX: Math.round(col * this.sideWidth),
          posY: Math.round(row * this.sideWidth),
          open: false,
          mine: Math.random() > 0.8 ? true : false,
          value: ''
        }
      }
    }
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

        this.land[row][col].posX = Math.round(row * width / COMPLEXITY)
        this.land[row][col].posY = Math.round(col * height / COMPLEXITY)
      }
    }
  }

  click(x, y) {
    if (this.gameOver) return

    let targetX = null
    let targetY = null

    for (let col = 0; col < COMPLEXITY; col++) {
      if (x > Math.round(col * this.sideWidth)) {
        if (x < Math.round((col + 1) * this.sideWidth)) {
          targetY = col
          break
        }
      }
    }

    for (let row = 0; row < COMPLEXITY; row++) {
      if (y > Math.round(row * this.sideWidth)) {
        if (y < Math.round((row + 1) * this.sideWidth)) {
          targetX = row
          break
        }
      }
    }

    if (!targetX || !targetY) {
      console.log('targetX, targetY error')
      return
    }

    this.open(targetX, targetY)
  }

  open (row, col) {
    const field = this.land[row][col]

    if (field.open) return
    field.open = true
    field.color = '#8a8a8a'

    if (field.mine) {
      field.value = '*'
      field.color = 'rgb(233, 66, 89)'
      this.toGameOver(field)
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
          if (row + r < 0 || row + r > 7) continue
          if (col + c < 0 || col + c > 7) continue
          this.open(row + r, col + c)
        }
      }
    }
  }

  toGameOver () {
    // this.gameOver = true
  }
}

export default Land
