module.exports = (function(){
  // Number, Number -> V2
  function Vector2(x, y){
    return {x: x, y: y};
  }
  
  // V2, V2 -> Number
  function angle(a, b){
    var ang = (Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x) + Math.PI*2) % (Math.PI*2);
    if (ang > Math.PI) ang -= Math.PI*2;
    return ang;
  };

  // V2 -> Number
  function len(a){
    return Math.sqrt(a.x*a.x + a.y*a.y);
  };

  // V2, Number -> V2
  function scale(a, s){
    return Vector2(a.x * s, a.y * s);
  };

  // V2 -> Number
  function normalize(a){
    return scale(a, 1/len(a)); 
  };

  // V2, Number -> V2
  function rotate(a, ang){
    return {
      x: a.x * Math.cos(ang) - a.y * Math.sin(ang),
      y: a.x * Math.sin(ang) + a.y * Math.cos(ang)};
  };

  // V2, V2 -> V2
  function sub(a, b){
    return {
      x: a.x - b.x,
      y: a.y - b.y};
  };

  // V2, V2 -> V2
  function add(a, b){
    return {
      x: a.x + b.x,
      y: a.y + b.y};
  };

  return {
    Vector2: Vector2,
    rotate: rotate,
    angle: angle,
    add: add,
    sub: sub,
    len: len,
    scale: scale,
    normalize: normalize};
})();
