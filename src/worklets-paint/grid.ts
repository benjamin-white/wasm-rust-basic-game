class Grid {

  static get inputProperties() {
    return [
      '--cell-size'
    ];
  }

  paint(ctx: CanvasRenderingContext2D, geometry: HTMLCanvasElement, props: any) {

    const CELL_SIZE = props.get('--cell-size').value || 50
    const GRID_SIZE = geometry.width
  
    ctx.beginPath()
    for (let i = 0; i <= GRID_SIZE; i += CELL_SIZE) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, GRID_SIZE)
      ctx.moveTo(0, i)
      ctx.lineTo(GRID_SIZE, i)
    }
    ctx.stroke()

  }

}

if (typeof registerPaint !== 'undefined') {
  registerPaint('grid', Grid)
}
