module.exports = (function(){
  var abs = Math.abs;
  var floor = Math.floor;
  var sqrt = Math.sqrt;

  function Hitbox(dim, pos, vel, fall){
    return {
      dim:dim,
      pos:pos,
      vel:vel,
      fall: fall};
  };

  function drawer(hitbox, c){
    return function(w, h, col){
      var hx = floor(hitbox.pos.x), hy = floor(hitbox.pos.y);
      var hw = hitbox.dim.x, hh = hitbox.dim.y;
      for (var y=-hh; y<=hh; ++y)
        for (var x=-hw; x<=hw; ++x)
          col[(hy+y)*w+(hx+x)] = c;
      return col;
    };
  };

  var spaceWidth = 2048;
  var spaceHeight = 2048;
  var space = new Uint8Array(spaceWidth * spaceHeight);
  function tick(dt, boxes){
    for (var i=0, l=boxes.length; i<l; ++i){
      var box = boxes[i];

      var w  = box.dim.x, h  = box.dim.y;
      var x  = box.pos.x, y  = box.pos.y;
      var vx = box.vel.x, vy = box.vel.y;
      var sw = spaceWidth;

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
      for (var k=0; k<=1; ++k){
        for (var t=0, ts=Math.abs((k?vx:vy)*dt); t<ts; ++t){
          var spd = Math.min(ts - t, 1) * Math.sign(k?vx:vy);
          if (k) x += spd;
          else   y += spd;
          for (var m=0; m<=1; ++m){
            for (var p=(m?-w:-h); p<(m?w:h); ++p){
              if ( space[(floor(y)+(m?-h:p))*sw + (floor(x)+(m?p:-w))]
                || space[(floor(y)+(m? h:p))*sw + (floor(x)+(m?p: w))]){
                if (k) x -= spd;
                else   y -= spd;
              };
            };
          };
        };
      };

      // Add to space
      for (var px=-w; px<w; ++px)
        space[(floor(y)-h) * sw + (floor(x)+px)] = 1,
        space[(floor(y)+h) * sw + (floor(x)+px)] = 1;
      for (var py=-h; py<h; ++py)
        space[(floor(y)+py) * sw + (floor(x)-w)] = 1,
        space[(floor(y)+py) * sw + (floor(x)+w)] = 1;

      // Save
      box.pos.x = x;
      box.pos.y = y;
      box.vel.x = vx;
      box.vel.y = vy;
    };
    return boxes;
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
    tick: tick};
})();
