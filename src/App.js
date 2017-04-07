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
  }
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
      if (allRowMatch || allColMatch) { return true; }
    }
    if (allTilesPlayed) { return true; }
    // Check the diagonal
    const center = gameboard[1][1];
    if (center !== null) {
      if ((gameboard[0][0] === center && gameboard[2][2] === center)
          || (gameboard[2][0] === center && gameboard[0][2] === center)) {
          return true;
      }
    }
    // No matches
    return false;
  }
  onChange (position) {
    this.setState(prevState => {
      let newState = Object.assign({}, prevState);
      // Update the position in the gameboard.
      newState.gameboard[position.row][position.col] = prevState.player;
      // Check for player winning.
      if (this.isGameOver(newState.gameboard)) {
        // If a player won, end the game.
        newState.gameOver = true;
        newState.winningPlayer = prevState.player;
      }
      // Update the player turn
      (prevState.player === 1) ? newState.player = 2 : newState.player = 1
      return newState
    })
  }
  render() {
    const { gameboard, gameOver, winningPlayer } = this.state;
    console.log(this.state);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {gameOver && <h1>Player {winningPlayer} Wins!</h1>}
        {!gameOver && <div className="App-intro">
          {gameboard.map((row, rindex) => {
            return (
              <div key={`row${rindex}`}>
                {row.map((col, cindex) => {
                  return (
                    <GameboardTile
                      key={`tile${cindex}`}
                      position={{row: rindex, col: cindex}}
                      onChange={this.onChange}
                      value={gameboard[rindex][cindex]}
                    />
                  );
                })}
              </div>
            )
          })}
        </div>}
      </div>
    );
  }
}

export default App;
