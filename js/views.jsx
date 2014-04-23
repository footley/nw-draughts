/** @jsx React.DOM */

var Piece = React.createClass({
  handleDragStart: function(e) {
    this.props.onPiecePickedUp(e, this.props.data);
  },
  handleDragEnd: function(e) {
    this.props.onPieceDropped(e, this.props.data);
  },
  render: function() {
    var classes = React.addons.classSet({
        "piece": true,
        "black": this.props.data.team === draughts.BLACK,
        "white": this.props.data.team === draughts.WHITE,
        "inhand": this.props.data.inhand,
        "inactive": !this.props.data.active,
        "king": this.props.data.king,
        "tobetaken": this.props.data.tobetaken
    });
    return (
        <div
            className={classes}
            data-x={this.props.data.x}
            data-y={this.props.data.y}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
        ></div>
    );
  }
});

var Square = React.createClass({
  handleDragEnter: function(e) {
    this.props.onSquareEntered(e, this.props.data);
  },
  handleDragLeave: function(e) {
    this.props.onSquareLeft(e, this.props.data);
  },
  render: function() {
    var classes = React.addons.classSet({
        "square": true,
        "drop": this.props.data.drop === "drop",
        "nodrop": this.props.data.drop === "nodrop",
        "black": this.props.data.color === draughts.BLACK,
        "white": this.props.data.color === draughts.WHITE,
    });
    return (
        <div
            className={classes}
            data-x={this.props.data.x}
            data-y={this.props.data.y}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
        ></div>
    );
  }
});

var Board = React.createClass({
  render: function() {
    var squares = this.props.board.squares.map((function (square) {
      return <Square
                key={square.getKey()}
                data={square}
                onSquareEntered={this.props.handleSquareEntered}
                onSquareLeft={this.props.handleSquareLeft}
             ></Square>;
    }).bind(this));
    var pieces = this.props.black.concat(this.props.white).map((function (piece) {
      return <Piece
                key={piece.getKey()}
                data={piece}
                onPiecePickedUp={this.props.handlePiecePickedUp}
                onPieceDropped={this.props.handlePieceDropped}
             ></Piece>;
    }).bind(this));
    return (
      <div className="board">
        {squares}
        {pieces}
      </div>
    );
  }
});

var GameInfo = React.createClass({
    render: function() {
        var blackClasses = React.addons.classSet({
            "player": true,
            "turn": this.props.game.turn === draughts.BLACK
        });
        var whiteClasses = React.addons.classSet({
            "player": true,
            "turn": this.props.game.turn === draughts.WHITE
        });
        return (
            <div>
                <span className={blackClasses}>Black {this.props.game.blackscore}</span>
                <span>  -  </span>
                <span className={whiteClasses}>{this.props.game.whitescore} White</span>
                <a href="#" 
                    className="reset"
                    onClick={this.props.handleReset}
                    >Restart</a>
            </div>
        );
    }
});

var Game = React.createClass({
    getInitialState: function() {
        this.game = new draughts.Game(this.props.boardsize);
        this.pickedPiece = null;
        this.hoverSquare = null;
        return this.game;
    },
    handleReset: function(e) {
        this.game = new draughts.Game(this.props.boardsize);
        this.pickedPiece = null;
        this.hoverSquare = null;
        this.setState(this.game);
    },
    handlePiecePickedUp: function(e, piece) {
        this.pickedPiece = piece;
        piece.inhand = true;
        this.setState(this.game);
    },
    handlePieceDropped: function(e, piece) {
        piece.inhand = false;
        var canmove = this.game.canmove(
            piece, this.hoverSquare.x, this.hoverSquare.y);
        if(canmove.result)
        {
            this.game.move(piece, this.hoverSquare.x, this.hoverSquare.y);
            this.setState(this.game);
        }
    },
    handleSquareEntered: function(e, square) {
        // we wrap this code in a timeout so that handleSquareLeft 
        // is guarenteed to happen first
        setTimeout((function(){
            this.hoverSquare = square;
            var canmove = this.game.canmove(
                this.pickedPiece, this.hoverSquare.x, this.hoverSquare.y);
            square.drop = canmove.result ? "drop" : "nodrop";
            for(var i=0; i<canmove.taken.length; i++)
                canmove.taken[i].tobetaken = true;
            this.setState(this.game);
        }).bind(this));
    },
    handleSquareLeft: function(e, square) {
        for(var i=0; i<this.game.black.length; i++)
            this.game.black[i].tobetaken = false;
        for(var i=0; i<this.game.white.length; i++)
            this.game.white[i].tobetaken = false;
        square.drop = "";
        this.setState(this.game);
    },
    render: function() {
        return (
            <div className="game">
                <GameInfo
                    game={this.state}
                    handleReset={this.handleReset}
                ></GameInfo>
                <Board
                    board={this.state.board}
                    black={this.state.black}
                    white={this.state.white}
                    handlePiecePickedUp={this.handlePiecePickedUp}
                    handlePieceDropped={this.handlePieceDropped}
                    handleSquareEntered={this.handleSquareEntered}
                    handleSquareLeft={this.handleSquareLeft}
                ></Board>
            </div>
        );
    }
});

React.renderComponent(
  <Game boardsize="8" />,
  document.getElementById('container')
);
