module.exports = (function(){
  // Uint, Uint -> Screen
  function Screen(width, height){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, width, height);
    var colorBuffer = new ArrayBuffer(width*height*4);
    var colorBuffer8 = new Uint8ClampedArray(colorBuffer);
    var colorBuffer32 = new Uint32Array(colorBuffer);
    var depthBuffer = new ArrayBuffer(width*height*2);
    var depthBuffer16 = new Uint16Array(depthBuffer);
    return {
      canvas: canvas,
      context: context,
      width: width,
      height: height,
      imageData: imageData,
      colorBuffer8: colorBuffer8,
      colorBuffer32: colorBuffer32,
      depthBuffer16: depthBuffer16};
  };

  // Uint32Array, *Screen -> Screen
  function drawBuffer(buffer8, screen){
    screen.imageData.data.set(buffer8);
    screen.context.putImageData(screen.imageData, 0, 0);
  };

  // [(Number, Number, *Uint32Array -> Uint32Array)] -> *Screen -> Screen
  function drawDrawers(drawers, screen){
    var colorBuffer32 = screen.colorBuffer32;
    for (var i=0, l=drawers.length; i<l; ++i)
      colorBuffer32 = drawers[i](screen.width, screen.height, colorBuffer32);
    screen.imageData.data.set(screen.colorBuffer8);
    screen.context.putImageData(screen.imageData, 0, 0);
    return screen;
  };

  // (Uint, Uint -> RGBA8), *Screen -> Screen
  function draw(field, screen){
    var colorBuffer32 = screen.colorBuffer32;
    var width = screen.width;
    var height = screen.height;
    for (var y=0; y<height; ++y)
      for (var x=0; x<width; ++x)
        colorBuffer32[y*width+x] = field(x, y);
    screen.imageData.data.set(screen.colorBuffer8);
    screen.context.putImageData(screen.imageData, 0, 0);
    return screen;
  };

  // *Screen -> Screen
  function clear(screen, col){
    screen.colorBuffer32.fill(col);
  };

  return {
    Screen: Screen,
    drawBuffer: drawBuffer,
    drawDrawers: drawDrawers,
    draw: draw,
    clear: clear};
})();

