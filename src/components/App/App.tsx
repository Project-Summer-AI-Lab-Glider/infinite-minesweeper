import React from "react";
import { GameBoard } from "../GameBoard/GameBoard";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <h1> Minesweeper </h1>
      </div>

      <div className="row">
        <div className="col" />

        <div
          className="col canvas d-flex justify-content-center"
          style={{ borderColor: "red", border: "solid" }}
        >
          <GameBoard />
        </div>

        <div className="col" />
      </div>
    </div>
  );
}

export default App;
