module.exports = (function(){
  var down = [], last = [], pressed = [], released = [];
  for (var i=0; i<255; ++i){
    var k = String.fromCharCode(i);
    down[k] = last[k] = pressed[k] = released[k] = 0;
  };
  document.onkeypress = function(e){
    down[String.fromCharCode(e.keyCode).toLowerCase()] = 1;
  };
  document.onkeyup = function(e){
    down[String.fromCharCode(e.keyCode).toLowerCase()] = 0;
  };
  function tick(){
    for (var i=0; i<255; ++i){
      var k = String.fromCharCode(i);
      pressed[k]  = !last[k] &&  down[k];
      released[k] =  last[k] && !down[k];
      last[k]     = down[k];
    };
  };
  return {down: down, pressed: pressed, released: released, tick: tick};
});
