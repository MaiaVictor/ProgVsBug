//var Image = require("./../../Dattata/Image.js");
var Screen = require("./Screen.js");
var Sprites = require("./Sprites.js");
var Hitbox = require("./Hitbox.js");
var Drawers = require("./Drawers.js");
var Vector2 = require("./Vector2.js");
var stages = require("./Stages.js");
var Key = require("./KeyboardState.js")();
var V2 = Vector2.Vector2;
var floor = Math.floor;
var sqrt = Math.sqrt;
var FPS = 60;
var sprites;
var screen = Screen.Screen(window.innerWidth, window.innerHeight);
var gameObjects;
var gameObjectById;
var hero;
var game;
var level;
var space;
var spaceWidth;
var spaceHeight;

var Neo = (function(){
  var nextId = 0;
  return function(w, h, x, y, fall){
    var id = ++nextId;
    var obj = {
      id: id,
      render: function(screen){},
      tick: function(dt){},
      destroy: function(){
        Hitbox.destroy(obj.hitbox, space, spaceWidth, spaceHeight);
        delete gameObjectById[obj.id];
        gameObjects = gameObjects.filter(function(obj_){
          return obj_.id !== obj.id;
        });
      },
      hitbox: Hitbox.Hitbox(id, V2(w, h), V2(x, y), V2(0, 0), fall)};
    gameObjects.push(obj);
    gameObjectById[obj.id] = obj;
    return obj;
  };
})();

var intro = Intro();
var menu = Menu();
var runningApp = intro;

function interact_with_human(kill_humans, be_nice_to_humans){
  var is_crazy_murdering_robot = false;
  if (is_crazy_murdering_robot = true)
    kill_humans();
  else
    be_nice_to_humans();
};

function Intro(){
  var selected = 0;
  var options = [0, 1, 2];
  var prev = {};
  function tick(dt){
    if (Key.pressed.w)
      selected = (selected - 1 + 3) % 3;
    if (Key.pressed.s)
      selected = (selected + 1 + 3) % 3;
    if (Key.pressed.j)
      StartLevel(0);
  };
  function render(screen){
    Screen.drawDrawers(options.map(function(i){
      var col = i === selected ? 0xFFAAAAAA : 0xFFCCCCCC;
      return Drawers.rectangle(32*5, 32*(1+i*2), 32*4, 16, col);
    }), screen);
  };
  return {tick: tick, render: render};
};

function KillerRobot(x, y){
  var obj = Neo(2, 2, x, y, 0);
  var charge = 0;
  obj.tick = function(dt){
    charge += dt;
    if (charge > 1){
      charge = 0;
      var dir = Vector2.sub(hero.hitbox.pos, obj.hitbox.pos);
      Laser(obj.hitbox.pos.x, obj.hitbox.pos.y, dir.x, dir.y);
    };
  };
  obj.draw = function(x, y){
    screen.context.drawImage(sprites.main_standing.images[0], x, y);
  };
  return obj;
};

function Laser(x, y, dx, dy){
  var d = Math.sqrt(dx*dx + dy*dy);
  var obj = Neo(3, 3, x+dx/d*16, y, 0);
  obj.type = "Laser";
  obj.hitbox.vel.x = dx/d*500;
  obj.hitbox.vel.y = dy/d*500;
  obj.draw = function(x, y){
    screen.context.drawImage(sprites.main_standing.images[0], x, y);
    //return Drawers.rectangle(x, y, obj.hitbox.dim.x, obj.hitbox.dim.y, 0xFFFFAAAA);
  };
  obj.onCollide = function(other){
    obj.destroy();
    if (other.type === "Hero")
      StartLevel(level);
      
  };
};

function Hero(x, y){
  var obj = Neo(16, 16, x, y, 400);
  var canJump = 1;
  obj.type = "Hero";
  obj.tick = function(dt){
    var pad = V2(Key.down.d - Key.down.a, Key.down.s - Key.down.w);
    obj.hitbox.vel.x = pad.x * 140;
    if (canJump && Key.pressed.j){
      obj.hitbox.vel.y = -220;
      canJump = 0;
    };
  };
  obj.draw = function(x, y){
    var i = Math.floor(((Date.now()/1000)*4)%2);
    screen.context.drawImage(sprites.main_standing.images[i], x, y);
  };
  obj.onCollide = function(obj){
    if (!obj) return; // TODO: FIXME
    if (obj.type === "Wall")
      canJump = 1;
    if (obj.type === "Door")
      StartLevel(level + 1);
  };
  return obj;
};

function Wall(x,y){
  var obj = Neo(16,16, x,y, 0);
  function tick(){};
  function draw(x, y){
    screen.context.drawImage(sprites.wall.images[0], x, y);
    //return Drawers.rectangle(x, y, obj.hitbox.dim.x, obj.hitbox.dim.y, 0xFFAAAAAA);
  };
  obj.type = "Wall";
  obj.tick = tick;
  obj.draw = draw;
  return obj;
};

function Door(x,y){
  var obj = Neo(16,16, x,y, 0);
  function tick(){};
  function draw(x, y){
    screen.context.drawImage(sprites.main_standing.images[0], x, y);
  };
  obj.type = "Door";
  obj.tick = tick;
  obj.draw = draw;
  return obj;
  
};

function Game(stage){
  var count = 0;
  gameObjects = [];
  gameObjectById = {};
  for (var j=0; j<stage.length; ++j){
    var line = stage[j];
    for (var i=0; i<line.length; ++i){
      switch (line[i]){
        case "H": hero = Hero(i*32-16, j*32-16); break;
        case "X": Wall(i*32-16, j*32-16); break;
        case "D": Door(i*32-16, j*32-16); break;
        case "K": KillerRobot(i*32-16, j*32-16); break;
      }
    };
  };

  function tick(dt){
    if (Key.pressed.m)
      runningApp = menu;
    for (var i=0, l=gameObjects.length; i<l; ++i){
      gameObjects[i].tick(dt);
      var collisions = Hitbox.tick(dt, space, spaceWidth, spaceHeight, gameObjects[i].hitbox);
      if (gameObjects[i].onCollide)
        for (var id in collisions){
          gameObjects[i].onCollide(gameObjectById[id]);
          if (gameObjectById[id].onCollide)
            gameObjectById[id].onCollide(gameObjectById[i]);
            
        }
    };
  };
  function render(screen){
    screen.context.clearRect(0, 0, screen.width, screen.height);
    for (var i=0; i<gameObjects.length; ++i){
      var obj = gameObjects[i];
      var pos = Vector2.add(
        Vector2.sub(obj.hitbox.pos, hero.hitbox.pos),
        V2(screen.width/2, screen.height/2));
      obj.draw(pos.x, pos.y);
    };
  };
  return {tick: tick, render: render};
};

function Menu(){
  function tick(dt){
    if (Key.pressed.j)
      runningApp = game;
  };
  function render(screen){
    Screen.drawDrawers([Drawers.rectangle(32, 32, 8, 8, 0xFFFFAAAA)], screen);
  };
  return {tick: tick, render: render};
};

function StartLevel(lv){
  console.log("?");
  setTimeout(function(){
    spaceWidth = 2048;
    spaceHeight = 2048;
    space = new Uint16Array(spaceWidth * spaceHeight);
    runningApp = game = Game(stages[lv%stages.length]);
    console.log("?", stages[lv%stages.length], lv, stages.length);
    level = lv;
  }, 1);
};

window.onload = function(){
  Sprites(function(sprites_){
    sprites = sprites_;
    var main = document.getElementById("main");
    screen.canvas.style = [
      "image-rendering: optimizeSpeed;",
      "image-rendering: -moz-crisp-edges;",
      "image-rendering: -webkit-optimize-contrast;",
      "image-rendering: -o-crisp-edges;",
      "image-rendering: pixelated;",
      "-ms-interpolation-mode: nearest-neighbor;"].join("");
    main.appendChild(screen.canvas);
    setInterval(function(){
      Key.tick();
      runningApp.tick(1/FPS);
      Screen.clear(screen);
      runningApp.render(screen);
    }, 1000/FPS);

    document.body.appendChild(sprites.main_standing.images[0]);
  });
};

