import React from 'react';
import './App.css';
import BoardComponentGeneral from './game/BoardComponentGeneral';
import BoardContainer from './game/BoardContainer';
import BoardHeader from './game/BoardHeader';

function App() {

  const timerInterval = 200

  return (
    <div className="App">
      <BoardContainer>
        <BoardHeader/>
        <BoardComponentGeneral
          timerInterval={timerInterval}
        />
      </BoardContainer>
    </div>
  );
}

export default App;
