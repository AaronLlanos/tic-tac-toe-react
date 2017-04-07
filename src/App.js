import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const BOARD_SIZE = 3

function GameboardTile ({value, onChange, position}) {
  function markSpot () {
    if (!value) {
      onChange(position);
    }
  }
  let marking = 'Click Me';
  if (value === 1) { marking = 'X'; }
  if (value === 2) { marking = 'O'; }
  return (
    <div onClick={markSpot}>
      {marking}
    </div>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameboard: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ],
      player: 1,
      winningPlayer: 0,
      gameOver: false
    };
    this.onChange = this.onChange.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }
  /**
   * Should take a matrix and determine whether any more moves can or should be
   * made.
   * @param  {Array}    gameboard   matrix of either null or player numbers
   * @return {Number}               -1 if a draw
   * @return {Number}               0 if game is not over
   * @return {Number}               1 if a player wins
   */
  isGameOver(gameboard) {
    let allTilesPlayed = true;
    // Check the rows and columns
    for (let i = 0; i < BOARD_SIZE; i++) {
      const initialRowValue = gameboard[i][0];
      const initialColValue = gameboard[0][i];
      let allRowMatch = true;
      let allColMatch = true;
      for (let j = 0; j < BOARD_SIZE; j++) {
        let rowCheckTile = gameboard[i][j];
        if (rowCheckTile === null || rowCheckTile !== initialRowValue) {
          allRowMatch = false;
        }
        let colCheckTile = gameboard[j][i];
        if (colCheckTile === null || colCheckTile !== initialColValue) {
          allColMatch = false;
        }
        if (rowCheckTile === null || colCheckTile === null) {
          allTilesPlayed = false;
        }
      }
      if (allRowMatch || allColMatch) { return 1; }
    }
    if (allTilesPlayed) { return -1; }
    // Check the diagonal
    const center = gameboard[1][1];
    if (center !== null) {
      if ((gameboard[0][0] === center && gameboard[2][2] === center)
          || (gameboard[2][0] === center && gameboard[0][2] === center)) {
          return 1;
      }
    }
    // No matches
    return 0;
  }
  onChange (position) {
    this.setState(prevState => {
      let newState = Object.assign({}, prevState);
      // Update the position in the gameboard.
      newState.gameboard[position.row][position.col] = prevState.player;
      // Check for player winning.
      const gameStatus = this.isGameOver(newState.gameboard)
      if (gameStatus !== 0) {
        newState.gameOver = true;
        if (gameStatus === 1) { newState.winningPlayer = prevState.player; }
      }
      // Update the player turn
      (prevState.player === 1) ? newState.player = 2 : newState.player = 1
      return newState
    })
  }
  resetBoard () {
    this.setState({
      gameboard: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ],
      player: 1,
      winningPlayer: 0,
      gameOver: false
    });
  }
  renderGameOverMessage (winningPlayer) {
    let message = `Congratulations! Player ${winningPlayer} wins!`;
    if (winningPlayer === 0) {
      message = 'It\'s a draw.'
    }
    return (
      <div>
        <h1>{message}</h1>
        <button onClick={this.resetBoard}>Play Again</button>
      </div>
    )
  }
  renderGameboard (gameboard) {
    return (
      <table className="table">
        <tbody>
          {gameboard.map((row, rindex) => {
            return (
              <tr key={`row${rindex}`}>
                {row.map((col, cindex) => {
                  return (
                    <td key={`tile${cindex}`}>
                      <GameboardTile
                        position={{row: rindex, col: cindex}}
                        onChange={this.onChange}
                        value={gameboard[rindex][cindex]}
                      />
                    </td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
  render() {
    const { gameboard, gameOver, winningPlayer } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          {gameOver && this.renderGameOverMessage(winningPlayer)}
          {!gameOver && this.renderGameboard(gameboard)}
        </div>
      </div>
    );
  }
}

export default App;
