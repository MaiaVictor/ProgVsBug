module.exports = (function(){
  var floor = Math.floor;
  function rectangle(x, y, w, h, c){
    x = floor(x);
    y = floor(y);
    return function(W, H, col){
      for (var j=-h; j<=h; ++j)
        for (var i=-w; i<=w; ++i)
          if (0<=(x+i) && (x+i)<W && 0<=(y+j) && (y+j)<H)
            col[(y+j)*W+(x+i)] = c;
      return col;
    };
  };
  return {rectangle: rectangle};
})();
