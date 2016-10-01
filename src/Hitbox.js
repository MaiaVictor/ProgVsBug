module.exports = (function(){
  var Drawers = require("./Drawers.js");

  var abs = Math.abs;
  var floor = Math.floor;
  var sqrt = Math.sqrt;

  function Hitbox(id, dim, pos, vel, fall){
    return {
      id:id,
      dim:dim,
      pos:pos,
      vel:vel,
      fall: fall};
  };

  function drawer(hitbox, c){
    return Drawers.rectangle(hitbox.pos.x, hitbox.pos.y, hitbox.dim.x, hitbox.dim.y, c);
  };

  function tick(dt, space, spaceWidth, spaceHeight, box){
    var w  = box.dim.x, h  = box.dim.y;
    var x  = box.pos.x, y  = box.pos.y;
    var vx = box.vel.x, vy = box.vel.y;
    var sw = spaceWidth;
    var id = box.id;

    // Integrate velocity
    vy += dt * box.fall;

    // Remove from space
    for (var px=-w; px<w; ++px)
      space[(floor(y)-h) * sw + (floor(x)+px)] = 0,
      space[(floor(y)+h) * sw + (floor(x)+px)] = 0;
    for (var py=-h; py<h; ++py)
      space[(floor(y)+py) * sw + (floor(x)-w)] = 0,
      space[(floor(y)+py) * sw + (floor(x)+w)] = 0;

    // Integrate position
    var collisions = {};
    for (var k=0; k<=1; ++k){
      for (var t=0, ts=Math.abs((k?vx:vy)*dt); t<ts; ++t){
        var spd = Math.min(ts - t, 1) * Math.sign(k?vx:vy);
        if (k) x += spd;
        else   y += spd;
        for (var m=0; m<=1; ++m){
          for (var p=(m?-w:-h); p<(m?w:h); ++p){
            if ( space[(floor(y)+(m?-h:p))*sw + (floor(x)+(m?p:-w))]
              || space[(floor(y)+(m? h:p))*sw + (floor(x)+(m?p: w))]){
              collisions[space[(floor(y)+(m?-h:p))*sw + (floor(x)+(m?p:-w))]] = true;
              collisions[space[(floor(y)+(m? h:p))*sw + (floor(x)+(m?p: w))]] = true;
              if (k) x -= spd, vx = 0;
              else   y -= spd, vy = 0;
            };
          };
        };
      };
    };

    // Add to space
    for (var px=-w; px<w; ++px)
      space[(floor(y)-h) * sw + (floor(x)+px)] = id,
      space[(floor(y)+h) * sw + (floor(x)+px)] = id;
    for (var py=-h; py<h; ++py)
      space[(floor(y)+py) * sw + (floor(x)-w)] = id,
      space[(floor(y)+py) * sw + (floor(x)+w)] = id;

    // Save
    box.pos.x = x;
    box.pos.y = y;
    box.vel.x = vx;
    box.vel.y = vy;

    // Returns collisions
    delete collisions[0];
    return collisions;
  };

  function destroy(box, space, spaceWidth, spaceHeight){
    var w  = box.dim.x, h  = box.dim.y;
    var x  = box.pos.x, y  = box.pos.y;
    var vx = box.vel.x, vy = box.vel.y;
    var sw = spaceWidth;
    // Remove from space
    for (var px=-w; px<w; ++px)
      space[(floor(y)-h) * sw + (floor(x)+px)] = 0,
      space[(floor(y)+h) * sw + (floor(x)+px)] = 0;
    for (var py=-h; py<h; ++py)
      space[(floor(y)+py) * sw + (floor(x)-w)] = 0,
      space[(floor(y)+py) * sw + (floor(x)+w)] = 0;
  };


  // *Hitbox, Hitbox -> Hitbox
  //function slide(a, b){
    //var ax = a.pos.x, ay = a.pos.y, aw = a.dim.x, ah = a.dim.y;
    //var bx = b.pos.x, by = b.pos.y, bw = b.dim.x, bh = b.dim.y;
    //var avx = a.vel.x, avy = a.vel.y;
    //var axi = ax - aw*0.5, axf = ax + aw*0.5;
    //var ayi = ay - ah*0.5, ayf = ay + ah*0.5;
    //var bxi = bx - bw*0.5, bxf = bx + bw*0.5;
    //var byi = by - bh*0.5, byf = by + bh*0.5;
    //var dx = abs(bx - ax) - (aw*0.5 + bw*0.5);
    //var dy = abs(by - ay) - (ah*0.5 + bh*0.5);

    //console.log("a:", ax, ay, aw, ah);
    //console.log("b:", bx, by, bw, bh);
    //console.log("av:", avx, avy);
    //console.log("axr:",axi, axf, "ayr:",ayi, ayf);
    //console.log("bxr:",bxi, bxf, "byr:",byi, byf);
    //console.log("d:",dx,dy);

    //if (bx >= 0 || dy >= 0)
      //return a;

    //if (dx > dy) {
      //if (bxi < axi && axi < bxf && avx <= 0) {
        //a.pos.x += bxf - axi;
        //a.vel.x = 0;
      //}
      //if (bxi < axf && axf < bxf && avx >= 0) {
        //a.pos.x += bxi - axf;
        //a.vel.x = 0;
      //}
    //} else  {
      //if (byi < ayi && ayi < byf && avy <= 0){
        //a.pos.y -= dy;
        //a.vel.y = 0;
      //}
      //if (byi < ayi && ayi < byf && avy >= 0){
        //a.pos.y += dy;
        //a.vel.y = 0;
      //}
    //};

    //return a;
  //};

  return {
    Hitbox: Hitbox,
    drawer: drawer,
    destroy: destroy,
    tick: tick};
})();
