import Constellation from "./Constellation/Constellation";
import { useState } from 'react';

function App() {
  return (
    <Constellation
      // key={count}
      width={window.innerWidth}
      height={window.innerHeight}
      className="constellation"

      starsColor="rgba(255, 255, 255, 1)"
      starsWidth={1.5}
      starsCount={140}
      starsVelocity={0.45}
      starsVelocityChaos={3e-3}

      lineColor="rgba(255, 255, 255, .8)"
      lineWidth={0.3}
      lineMaxDistance={150}
      lineCursorRadius={100}
    />
  );
}

export default App;
