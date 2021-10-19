import Constellation from "./Constellation/Constellation";
import React, { useEffect, useState } from 'react';

function App() {
  const [size, setSize] = useState({
    width: window.innerWidth, height: window.innerHeight
  });

  useEffect(() => {
    function onResize() {
      setSize({
        width: window.innerWidth, height: window.innerHeight
      });
    }
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [])


  return (
    <Constellation
      // key={count}
      width={size.width}
      height={size.height}
      className="constellation"

      starsColor="rgba(255, 255, 255, 1)"
      starsWidth={1.1*size.width/1200}
      starsCount={500*size.width/1200}
      starsVelocity={0.45*size.width/1200}
      starsVelocityChaos={3e-3}

      lineColor="rgba(255, 255, 255, .8)"
      lineWidth={0.3*size.width/1200}
      lineMaxDistance={80*size.width/1200}
      lineCursorRadius={100*size.width/1200}
    />
  );
}

export default App;
