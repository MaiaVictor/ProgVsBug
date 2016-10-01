
function print(a){
  var s = "";
  for (var j = 0; j < spaceHeight; ++j){
    for (var i = 0; i < spaceWidth; ++i)
      s += space[j*spaceWidth+i] ? "X" : ".";
    s += "\n";
  };
  console.log(s);
};

