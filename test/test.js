var assert = require("assert")
var checkers = require("../js/checkers")
describe('Board', function(){
  describe('initialization', function(){

    debugger
    var b = new checkers.Model(8);

    it('there should be (boardsize / 2) * 3 pieces of each team', function(){
      assert.equal(12, b.white.length);
      assert.equal(12, b.black.length);
    })

    it('white teams pieces should be placed at the correct coordinates', function(){
      assert.equal(1, b.white[0].x);
      assert.equal(0, b.white[0].y);
      assert.equal(3, b.white[1].x);
      assert.equal(0, b.white[1].y);
      assert.equal(5, b.white[2].x);
      assert.equal(0, b.white[2].y);
      assert.equal(7, b.white[3].x);
      assert.equal(0, b.white[3].y);

      assert.equal(0, b.white[4].x);
      assert.equal(1, b.white[4].y);
      assert.equal(2, b.white[5].x);
      assert.equal(1, b.white[5].y);
      assert.equal(4, b.white[6].x);
      assert.equal(1, b.white[6].y);
      assert.equal(6, b.white[7].x);
      assert.equal(1, b.white[7].y);

      assert.equal(1, b.white[8].x);
      assert.equal(2, b.white[8].y);
      assert.equal(3, b.white[9].x);
      assert.equal(2, b.white[9].y);
      assert.equal(5, b.white[10].x);
      assert.equal(2, b.white[10].y);
      assert.equal(7, b.white[11].x);
      assert.equal(2, b.white[11].y);
    })

    it('black teams pieces should be placed at the correct coordinates', function(){
      assert.equal(0, b.black[0].x);
      assert.equal(5, b.black[0].y);
      assert.equal(2, b.black[1].x);
      assert.equal(5, b.black[1].y);
      assert.equal(4, b.black[2].x);
      assert.equal(5, b.black[2].y);
      assert.equal(6, b.black[3].x);
      assert.equal(5, b.black[3].y);

      assert.equal(1, b.black[4].x);
      assert.equal(6, b.black[4].y);
      assert.equal(3, b.black[5].x);
      assert.equal(6, b.black[5].y);
      assert.equal(5, b.black[6].x);
      assert.equal(6, b.black[6].y);
      assert.equal(7, b.black[7].x);
      assert.equal(6, b.black[7].y);

      assert.equal(0, b.black[8].x);
      assert.equal(7, b.black[8].y);
      assert.equal(2, b.black[9].x);
      assert.equal(7, b.black[9].y);
      assert.equal(4, b.black[10].x);
      assert.equal(7, b.black[10].y);
      assert.equal(6, b.black[11].x);
      assert.equal(7, b.black[11].y);
    })
  })
})