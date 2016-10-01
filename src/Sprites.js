module.exports = function(callback){
  var sprites = {
    "wall": {size: 1, images:[]},
    "main_standing": {size: 2, images:[]}};
  var loaded = 0;
  var total = 0;
  for (var key in sprites){
    (function (key){
      console.log("loading sprite "+key);
      for (var i=0; i<sprites[key].size; ++i){
        (function(i){
          ++total;
          var image = new Image();
          image.src = "img/"+key+"/sprite_"+i+".png";
          image.onload = function(){
            console.log("loaded "+(loaded+1)+"/"+total);
            sprites[key].images[i] = image;
            if (++loaded === total)
              callback(sprites);
          };
        })(i);
      };
    })(key);
  };
};


