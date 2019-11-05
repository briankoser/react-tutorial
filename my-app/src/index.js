import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={`square ${props.win ? 'win' : ''}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}  
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            win={this.props.winnerLine.includes(i)}
            onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      let rows = [];

      for(let i = 0; i < 3; i++) {
        let squares = [];
        for(let j = 0; j < 3; j++) {
          squares.push(this.renderSquare(i * 3 + j));
        }
        rows.push(<div className="board-row">{squares}</div>);
      }

      return (
        <div>{rows}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        sortHistoryDesc: true,
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
          return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      const column = (i % 3) + 1;
      let row = 0;
      if (i < 3) 
        row = 1;
      else if (i < 6) 
        row = 2; 
      else 
        row = 3;

      this.setState({
        history: history.concat([{column, row, squares}]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winData = calculateWinner(current.squares) || {};
      const winner = winData.winner;
      const winnerLine = winData.line || [];

      const moves = history.map((step, move) => {
        const desc = move
          ? `Go to move #${move} (${step.column}, ${step.row})`
          : `Go to game start`;
        return (
          <li key={move}>
            <button className={move === this.state.stepNumber ? 'bold' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      if (!this.state.sortHistoryDesc) {
        moves.reverse();
      }

      let status;
      if (winner) {
        status = `Winner ${winner}`;
      } else if (history.length === 10) {
        status = 'Draw';
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              winnerLine={winnerLine}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.setState({sortHistoryDesc: !this.state.sortHistoryDesc})}>{this.state.sortHistoryDesc ? 'Sort Asc' : 'Sort Desc'}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          line: lines[i]
        };
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  