/** @jsx React.DOM */
"use strict";

var draughts = draughts || {};

(function() {
    draughts.Piece = function(team, x, y) {
        this.team = team;
        this.x = x;
        this.y = y;
    };

    draughts.Model = function(boardsize) {
        this.white = [];
        this.black = [];
        for(var y=0; y<3; y++) {
            for(var x=1; x<boardsize; x+=2) {
                this.white.push(new draughts.Piece("white", x-(y%2), y))
            }
        }
        for(var y=boardsize-3; y<boardsize; y++) {
            for(var x=1; x<boardsize; x+=2) {
                this.black.push(new draughts.Piece("black", x-(y%2), y))
            }
        }
    };
})();

if(module)
    module.exports = draughts;