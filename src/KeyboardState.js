module.exports = (function(){
  var keyboard = [];
  for (var i=0; i<255; ++i)
    keyboard[String.fromCharCode(i)] = 0;
  document.onkeypress = function(e){
    keyboard[String.fromCharCode(e.keyCode).toLowerCase()] = 1;
  };
  document.onkeyup = function(e){
    keyboard[String.fromCharCode(e.keyCode).toLowerCase()] = 0;
  };
  return keyboard;
});
