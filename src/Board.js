import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25,
  };

  constructor(props) {
    super(props);

    this.state = {
      board: this.createBoard(),
      hasWon: false,
    };
    this.createBoard = this.createBoard.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  createBoard() {
    let boardArray = [];
    let innerArray = [];

    for (let i = 0; i < this.props.nRows; i++) {
      innerArray = [];
      for (let j = 0; j < this.props.nCols; j++) {
        //randomly pushing true or false into the array
        innerArray.push(Math.random() < this.props.chanceLightStartsOn);
      }
      boardArray[i] = innerArray;
    }

    return boardArray;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { nCols, nRows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[y][x] = !board[y][x];
      }
    }

    //flips cell clicked
    flipCell(y, x);

    //flip the cells around it

    flipCell(y - 1, x);
    flipCell(y + 1, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    let hasWon = false;
    let unlitCells = 0;
    for (let a = 0; a < nRows; a++) {
      for (let b = 0; b < nCols; b++) {
        if (!board[b][a]) {
          unlitCells++;
        }
      }
    }
    console.log(unlitCells);
    if (unlitCells === this.props.nCols * this.props.nRows) {
      hasWon = true;
    }
    this.setState({ board, hasWon });
  }

  restartGame() {
    this.setState({
      board: this.createBoard(),
      hasWon: false,
    });
  }

  handleClick(e) {
    this.restartGame();
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else

    // TODO

    // make table board
    let tblBoard = [];
    for (let y = 0; y < this.props.nRows; y++) {
      let row = [];
      for (let x = 0; x < this.props.nCols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            isLit={this.state.board[y][x]}
            key={coord}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }

      tblBoard.push(<tr>{row}</tr>);
    }

    const instructions = (
      <h2 className="instructions">Instructions: <br/>
        Select a box to switch it. <br />
        Surrounding boxes will also switch. <br />
        Switch all the boxes off to win!
      </h2>
    );
    return (
      <div className="Board">
        <div className="Sign">
          <span className="fast-flicker">Li</span>ghts
          <span className="flicker"> O</span>ut
        </div>

        {!this.state.hasWon ? (
          <div className="Board-boxes">
            <table>
              <tbody>{tblBoard}</tbody>
            </table>
          </div>
        ) : (
          <div>
            <span className="flicker Sign">You Win!</span>
            <br />
            <button className="btn btn-warning" onClick={this.handleClick}>
              Play Again!
            </button>
          </div>
        )}

        {!this.state.hasWon && instructions}
      </div>
    );
  }
}

export default Board;
