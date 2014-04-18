/** @jsx React.DOM */

var Piece = React.createClass({
  handleDragStart: function(e) {
    this.props.onPiecePickedUp(e, this.props.data);
  },
  handleDragEnd: function(e) {
    this.props.onPieceDropped(e, this.props.data);
  },
  render: function() {
    var classes = "piece";
    classes += " " + this.props.data.team;
    if(this.props.data.inhand)
        classes += " inhand";
    if(!this.props.data.active)
        classes += " inactive";
    if(this.props.data.king)
        classes += " king"
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
    return (
        <div
            className={"square " + this.props.data.color + " " + this.props.data.drop}
            data-x={this.props.data.x}
            data-y={this.props.data.y}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
        ></div>
    );
  }
});

var Board = React.createClass({
  getInitialState: function() {
    this.board = new draughts.Board(this.props.size);
    this.pickedPiece = null;
    this.hoverSquare = null;
    return this.board;
  },
  handlePiecePickedUp: function(e, piece) {
    this.pickedPiece = piece;
    piece.inhand = true;
    this.setState(this.board);
  },
  handlePieceDropped: function(e, piece) {
    piece.inhand = false;
    var canmove = this.board.canmove(piece, this.hoverSquare.x, this.hoverSquare.y);
    if(canmove.result)
    {
        this.board.move(piece, this.hoverSquare.x, this.hoverSquare.y);
        this.setState(this.board);
    }
  },
  handleSquareEntered: function(e, square) {
    this.hoverSquare = square;
    var canmove = this.board.canmove(this.pickedPiece, this.hoverSquare.x, this.hoverSquare.y);
    square.drop = canmove.result ? "drop" : "nodrop";
    this.setState(this.board);
  },
  handleSquareLeft: function(e, square) {
    square.drop = "";
    this.setState(this.board);
  },
  render: function() {
    var that = this;
    var squares = this.state.squares.map(function (square) {
      return <Square
                key={square.getKey()}
                data={square}
                onSquareEntered={that.handleSquareEntered}
                onSquareLeft={that.handleSquareLeft}
             ></Square>;
    });
    var pieces = this.state.black.concat(this.state.white).map(function (piece) {
      return <Piece
                key={piece.getKey()}
                data={piece}
                onPiecePickedUp={that.handlePiecePickedUp}
                onPieceDropped={that.handlePieceDropped}
             ></Piece>;
    });
    return (
      <div className="board">
        {squares}
        {pieces}
      </div>
    );
  }
});

React.renderComponent(
  <Board size="8" />,
  document.getElementById('container')
);
