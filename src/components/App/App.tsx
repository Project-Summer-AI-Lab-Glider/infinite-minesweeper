import React from "react";
import { GameBoard } from "../GameBoard/GameBoard";

function App() {
  return (
    <div className="container d-flex flex-column justify-content-center vh-100">
      <span className="text-center" style={{ marginBottom: "2%" }}>
        <h1>Minesweeper</h1>
      </span>

      <div
        className="h-75 w-100"
        style={{ color: "red", border: "solid", borderWidth: 2 }}
      >
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
