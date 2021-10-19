import React, { useState, useEffect, useCallback } from 'react';
import useAnimationFrame from "./useAnimationFrame";


function Constellation(props) {
  // console.log("Constellation")
  const {
    width, height, className,
    starsColor, starsWidth, starsCount, starsVelocity, starsVelocityChaos,
    lineColor, lineWidth, lineMaxDistance, lineCursorRadius,
    initStars,
  } = props;

  const [stars, setStars] = useState([])

  const [mousePosition, setMousePosition] = useState({
    x: width * 0.5,
    y: height * 0.5
  })

  const canvasRef = React.useRef(null)

  useEffect(() => {
    console.log("Constellation useEffect")
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')

    function createAllStars() {
      function createStar(x, y) {
        return {
          x: x || (Math.random() * width),
          y: y || (Math.random() * height),
          velX: starsVelocity * (Math.random() - 0.5),
          velY: starsVelocity * (Math.random() - 0.5),
        }
      }
      const starList = [];
      let i;
      for (i = 0; i < initStars.length && i < starsCount; i++) {
        const star = initStars[i];
        starList.push(createStar(
          star.x * width,
          star.y * height + height / 2
        ));
      }

      for (; i < starsCount; i++) {
        starList.push(createStar());
      }
      console.log("starList", starList)

      setStars(starList);
    }
    function setCanvas() {
      context.fillStyle = starsColor;
      context.strokeStyle = lineColor;
      context.lineWidth = lineWidth;
    }

    createAllStars();
    setCanvas();

    function onMouseMove(e) {
      setMousePosition({
        x: e.pageX - canvas.getBoundingClientRect().left,
        y: e.pageY - canvas.getBoundingClientRect().top
      })
    }

    document.addEventListener('mousemove', onMouseMove);

    return function () {
      document.removeEventListener('mousemove', onMouseMove)
    }
    // .on('resize', this.handlers.window.resize.bind(this));

  }, [height, initStars, lineColor, lineWidth, starsColor, starsCount, starsVelocity, width])


  const drawStars = useCallback((context) => {
    // console.log("drawStars", stars.length)
    stars.forEach(star => {

      // console.log("star", star)
      context.beginPath();
      // context.arc(100, 75, 50, 0, 2 * Math.PI);
      context.arc(star.x, star.y, starsWidth, 0, Math.PI * 2, false);
      context.fill();
    });
  }, [stars, starsWidth])

  const drawLines = useCallback(context => {
    // console.log("drawLines", stars.length);
    if (!stars.length) return;
    for (let i = 0; i < starsCount; i++) {
      for (let j = 0; j < starsCount; j++) {
        const iStar = stars[i];
        const jStar = stars[j];

        if (
          Math.abs(iStar.x - jStar.x) < lineMaxDistance &&
          Math.abs(iStar.y - jStar.y) < lineMaxDistance
        ) {
          if (
            Math.abs(iStar.x - mousePosition.x) < lineCursorRadius &&
            Math.abs(iStar.y - mousePosition.y) < lineCursorRadius
            // to improve jStar
          ) {
            // console.log(iStar.x, iStar.y, mousePosition)
            context.beginPath();
            context.moveTo(iStar.x, iStar.y);
            context.lineTo(jStar.x, jStar.y);
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  }, [stars, mousePosition, starsCount, lineMaxDistance, lineCursorRadius])

  const animateStars = useCallback(() => {
    stars.forEach(star => {
      if (star.y < 0 || star.y > height || Math.random() < starsVelocityChaos) {
        star.velY = - star.velY;
      }
      if (star.x < 0 || star.x > width || Math.random() < starsVelocityChaos) {
        star.velX = - star.velX;
      }

      star.x += star.velX;
      star.y += star.velY;
    });
  }, [stars, height, starsVelocityChaos, width])


  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawStars(context);
    drawLines(context);
    animateStars();
  }, [stars, mousePosition])

  return (
    <>
      <canvas
        className={className}
        ref={canvasRef}
        width={width}
        height={height}
      />
    </>
  )
}

Constellation.defaultProps = {
  width: window.innerWidth,   // width of canvas
  height: window.innerHeight, // height of canvas
  starsColor: 'black',
  starsWidth: 1,
  starsCount: 100,      // 畫面上有多少stars
  starsVelocity: 0.1,    // stars的移動速度
  starsVelocityChaos: 8e-4,    // stars的移動方向，多大的機率會被改變

  lineColor: 'black',
  lineWidth: 0.2,
  lineMaxDistance: 120,    // 兩個stars間隔多遠以內，就要連線
  lineCursorRadius: 150,      // 以滑鼠位置為圓心，多大的範圍內要highlight lines

  initStars: [],    // 指定一開始stars的位置
}





export default Constellation;
