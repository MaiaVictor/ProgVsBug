module.exports = function(){
  function square(width, height){
    return function(cons, nil){
      for (var y=0; y<height; ++y)
        for (var x=0; x<width; ++x)
          nil = cons(x, y, nil);
      return nil;
    };
  };

  return {
    square: square};
};
