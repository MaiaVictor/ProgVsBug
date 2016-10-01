//var Image = require("./../../Dattata/Image.js");
var Screen = require("./Screen.js");
var Hitbox = require("./Hitbox.js");
var Vector2 = require("./Vector2.js");
var Key = require("./KeyboardState.js")();
var V2 = Vector2.Vector2;
var floor = Math.floor;
var sqrt = Math.sqrt;
var FPS = 60;

function print(a){
  var s = "";
  for (var j = 0; j < spaceHeight; ++j){
    for (var i = 0; i < spaceWidth; ++i)
      s += space[j*spaceWidth+i] ? "X" : ".";
    s += "\n";
  };
  console.log(s);
};

window.onload = function(){
  var main = document.getElementById("main");
  var screen = Screen.Screen(320, 320);
  var spd = 3;
  var hero = Hitbox.Hitbox(V2(16, 16), V2(100, 16), V2(0, 0), 60);
  var stage = Hitbox.Hitbox(V2(80, 16), V2(180, 128), V2(0, 0), 0);

  setInterval(function mainLoop(){
    var pad = V2(Key.d - Key.a, Key.s - Key.w);
    hero.vel.x = pad.x * 64;
    var boxes = [hero, stage];

    Hitbox.tick(1/FPS, boxes);

    Screen.clear(screen);
    Screen.drawDrawers(boxes.map(function(box){
      return Hitbox.drawer(box, 0xFFAAAAAA);
    }), screen);
  }, 1000/FPS);

  screen.canvas.style = "border: 1px solid gray";
  main.appendChild(screen.canvas);
};
