/** @jsx React.DOM */
"use strict";

var draughts = draughts || {};

(function() {
    draughts.BLACK = "black";
    draughts.WHITE = "white";

    draughts.Square = function(color, x, y) {
        this.color = color;
        this.x = x;
        this.y = y;
    };

    draughts.Square.prototype.getKey = function() {
        return this.x.toString() + "_" + this.y.toString();
    };

    draughts.Piece = function(board, team, x, y, unique) {
        this.board = board;
        this.team = team;
        this.x = x;
        this.y = y;
        this.unique = unique;
        this.king = false;
        this.active = true;
        this.inhand = false;
    };

    draughts.Piece.prototype.getKey = function() {
        return this.team + "_" + this.unique;
    };

    draughts.Piece.prototype.take = function() {
        this.active = false;
        this.x = -1;
        this.y = -1;
    };

    draughts.Piece.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;

        // needs kinging?
        if(this.team === draughts.BLACK && y === 7)
            this.king = true;
        else if(this.team === draughts.WHITE && y === 0)
            this.king = true;

        return true;
    };

    draughts.Board = function(boardsize) {
        this.boardsize = boardsize;
        this.squares = [];
        var iswhite = true;
        for(var y=0; y<boardsize; y++) {
            for(var x=0; x<boardsize; x++) {
                this.squares.push(new draughts.Square(iswhite ? draughts.WHITE : draughts.BLACK, x, y));
                iswhite = !iswhite;
            }
            iswhite = !iswhite;
        }
    };

    draughts.Board.prototype.arecoordsinbounds = function(x, y) {
        return (x >= 0 && y >= 0 && x < this.boardsize && y < this.boardsize);
    };

    draughts.Game = function(boardsize) {
        this.turn = draughts.BLACK;
        this.board = new draughts.Board(boardsize);
        this.black = [];
        this.white = [];
        this.blackscore = 0;
        this.whitescore = 0;
        var i=0;
        for(var y=0; y<3; y++) {
            for(var x=1; x<boardsize; x+=2) {
                this.black.push(new draughts.Piece(this, draughts.BLACK, x-(y%2), y, i++));
            }
        }
        i=0;
        for(var y=boardsize-3; y<boardsize; y++) {
            for(var x=1; x<boardsize; x+=2) {
                this.white.push(new draughts.Piece(this, draughts.WHITE, x-(y%2), y, i++));
            }
        }
    };

    draughts.Game.prototype.currentTeam = function() {
        return this.turn === draughts.BLACK ? this.black : this.white;
    };

    draughts.Game.prototype.opositionTeam = function() {
        return this.turn === draughts.BLACK ? this.white : this.black;
    };

    draughts.Game.prototype.move = function(piece, x, y) {
        // were any pieces taken?
        var res = this.canmove(piece, x, y);
        if(!res.result)
            return;
        for(var i=0; i<res.taken.length; i++) {
            res.taken[i].take();
            if(res.taken[i].team === draughts.BLACK)
                this.whitescore++;
            else if(res.taken[i].team === draughts.WHITE)
                this.blackscore++;
        }
        piece.move(x, y);
        this.turn = this.turn === draughts.BLACK ? draughts.WHITE : draughts.BLACK;
    };

    draughts.Game.prototype.canmove = function(piece, x, y) {
        // is it this pieces turn to move?
        if(this.turn !== piece.team)
            return {'result': false, 'taken': []};

        // ensure move is inbounds
        if(!this.board.arecoordsinbounds(x, y))
            return {'result': false, 'taken': []};

        // ensure non kings only move forward
        if(!piece.king)
        {
            if(piece.team === draughts.BLACK && y <= piece.y)
                return {'result': false, 'taken': []};
            else if(piece.team === draughts.WHITE && y >= piece.y)
                return {'result': false, 'taken': []};
        }

        // ensure space is not occupied
        if(issquareoccupied(this.black, x, y) || issquareoccupied(this.white, x, y))
            return {'result': false, 'taken': []};

        // a valid move is diagonal and one space
        if(piece.x+1 === x && piece.y+1 === y)
            return {'result': true, 'taken': []};
        if(piece.x-1 === x && piece.y-1 === y)
            return {'result': true, 'taken': []};
        if(piece.x+1 === x && piece.y-1 === y)
            return {'result': true, 'taken': []};
        if(piece.x-1 === x && piece.y+1 === y)
            return {'result': true, 'taken': []};

        // or move is diagonal and two spaces, with an oposition piece in between
        var taken = canmove(piece.x, piece.y, x, y, piece.king, piece.team, this.opositionTeam());
        if(taken)
            return {'result': true, 'taken': taken};
        
        return {'result': false, 'taken': []};
    };

    // helpers
    function issquareoccupied(team, x, y) {
        for(var i=0; i<team.length; i++) {
            if(team[i].x === x && team[i].y === y)
                return team[i];
        }
        return false;
    };

    function canmove(from_x, from_y, to_x, to_y, isking, team, opositionTeam, checked) {
        checked = checked || [];
        var key = from_x.toString()+","+from_y.toString();
        if(checked.indexOf(key) !== -1)
            return null;
        checked.push(key); 

        // starting at (from_x, from_y) can we move to (to_x, to_y) always taking oposition pieces?
        // if piece is not king then it can only move forward.

        // first there must be an adjacent oposition piece, lets look for one and jump it
        
        if(isking || team === draughts.BLACK) {
            var res = __fragment(1, 1, from_x, from_y, to_x, to_y, opositionTeam, isking, team, checked);
            if(res)
                return res;

            var res = __fragment(-1, 1, from_x, from_y, to_x, to_y, opositionTeam, isking, team, checked);
            if(res)
                return res;
        }

        if(isking || team === draughts.WHITE) {
            var res = __fragment(-1, -1, from_x, from_y, to_x, to_y, opositionTeam, isking, team, checked);
            if(res)
                return res;

            var res = __fragment(+1, -1, from_x, from_y, to_x, to_y, opositionTeam, isking, team, checked);
            if(res)
                return res;
        }
        
        return null;
    };

    function __fragment(xmove, ymove, from_x, from_y, to_x, to_y, opositionTeam, isking, team, checked)
    {
        var taken = issquareoccupied(opositionTeam, from_x+xmove, from_y+ymove);
        if(taken) {
            if(from_x+(xmove*2) === to_x && from_y+(ymove*2) === to_y)
                return [taken];
            else {
                var result = canmove(from_x+(xmove*2), from_y+(ymove*2), to_x, to_y, isking, team, opositionTeam, checked)
                if(result)
                    return [taken].concat(result);
            }
        }
        return null;
    }
})();

if(typeof module !== "undefined")
    module.exports = draughts;