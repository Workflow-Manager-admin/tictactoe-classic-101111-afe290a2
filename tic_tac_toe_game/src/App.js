import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // Game state: 'X' always goes first
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('ongoing'); // 'ongoing', 'draw', 'win'
  const [winner, setWinner] = useState(null);

  // Colors
  const colors = {
    primary: '#fa0000',    // X color
    secondary: '#222222',  // O color
    accent: '#4caf50',     // Win highlight, turn display
    background: '#f9f9f9',
  };

  // PUBLIC_INTERFACE
  function calculateWinner(squares) {
    // Returns 'X', 'O', or null
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6],         // diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (board[index] !== null || status !== 'ongoing') {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winResult = calculateWinner(newBoard);
    if (winResult) {
      setStatus('win');
      setWinner(winResult.winner);
    } else if (newBoard.every(x => x !== null)) {
      setStatus('draw');
      setWinner(null);
    } else {
      setIsXNext(!isXNext);
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(emptyBoard);
    setIsXNext(true);
    setStatus('ongoing');
    setWinner(null);
  }

  // PUBLIC_INTERFACE
  function getStatusMessage() {
    if (status === 'win') return (
      <span>
        <span style={{color: colors.accent, fontWeight:600}}>{winner}</span> wins!
      </span>
    );
    if (status === 'draw') return "It's a draw!";
    return <span>
      Turn:&nbsp;
      <span style={{
        color: isXNext ? colors.primary : colors.secondary,
        fontWeight: 'bold'
      }}>
        {isXNext ? 'X' : 'O'}
      </span>
    </span>;
  }

  // Helper for highlight winning cells
  const winLine = status === 'win' ? calculateWinner(board)?.line : [];

  // Styling override to use color palette, centered column layout
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'start'
    }}>
      <nav className="navbar" style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        color: colors.secondary,
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99,
      }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center'
          }}>
            <div className="logo" style={{ color: colors.primary }}>
              <span style={{ fontWeight: 900, fontSize: 22, marginRight: 8 }}>⭕️</span> TicTacToe Classic
            </div>
            <span style={{
              color: '#bbb',
              fontWeight: 400,
              fontSize: 16
            }}>
              Built with React
            </span>
          </div>
        </div>
      </nav>
      {/* Main centered container for the game */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        marginTop: 80,
        paddingBottom: 40,
      }}>
        {/* Current player's turn display */}
        <div style={{
          fontSize: 24,
          fontWeight: 500,
          marginBottom: 32,
          color: colors.accent,
          textShadow: '0 1px 2px #fafafa'
        }}>
          {getStatusMessage()}
        </div>
        {/* Game board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 70px)',
          gridTemplateRows: 'repeat(3, 70px)',
          gap: 8,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 16px 0 rgba(35,35,35,.09)',
          padding: 20,
          marginBottom: 28,
          alignItems: 'center',
          justifyItems: 'center'
        }}>
          {board.map((cell, idx) =>
            <button
              key={idx}
              className="ttt-square"
              onClick={() => handleSquareClick(idx)}
              style={{
                outline: 'none',
                border: `2.5px solid ${winLine && winLine.includes(idx) ? colors.accent : '#eeeeef'}`,
                background: status !== 'ongoing' && winLine.includes(idx)
                  ? colors.accent
                  : '#fafbfc',
                color:
                  cell === 'X'
                    ? colors.primary
                    : cell === 'O'
                      ? colors.secondary
                      : '#bdbdbd',
                fontSize: 34,
                fontWeight: 700,
                cursor: cell === null && status === 'ongoing' ? 'pointer' : 'default',
                width: 65,
                height: 65,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.18s, border 0.18s'
              }}
              aria-label={`Square ${idx + 1}`}
            >
              {cell}
            </button>
          )}
        </div>
        {/* Game status & restart */}
        <div style={{
          minHeight: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {status !== 'ongoing' &&
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.accent,
              marginBottom: 8
            }}>
              {status === 'win' ? (
                <span>
                  🎉 <span style={{color: colors.primary}}>{winner}</span> wins the game!
                </span>
              ) : (
                <span>It's a draw!</span>
              )}
            </div>
          }
          <button
            className="btn"
            style={{
              marginTop: 6,
              background: colors.primary,
              color: '#fff',
              padding: '9px 28px',
              borderRadius: 6,
              border: 'none',
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px 0 rgba(180, 0, 0, 0.07)',
              cursor: 'pointer',
            }}
            onClick={handleRestart}
            aria-label="Restart game"
            data-testid="restart-btn"
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
