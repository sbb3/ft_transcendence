// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect } from "react";

const Game = () => {
  useTitle("Gamee");
  const [canvasContext1, setCanvasContext1] = useState(null);
  const [canvasContext2, setCanvasContext2] = useState(null);
  const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
    
		const context1 = canvas.getContext("2d");
    context1.strokeStyle = "orange";
    context1.lineWidth = 3;
    // context1.shadowColor = "#ddf";
    // context1.shadowBlur = 25;
    context1.strokeRect(20,300,20,90);

    const context2 = canvas.getContext("2d");
    context2.strokeStyle = "green";
    // context2.shadowColor = "#ddf";
    // context2.shadowBlur = 25;
    context2.strokeRect(984,140,20,90);



      // line.lineWidth = 4;
      // line.strokeStyle = "pink";
      // line.moveTo(235, 0);
      // line.lineTo(0, 400);
      // line.stroke();


    const res1 = canvas.getContext("2d");
    res1.strokeStyle = "orange";
    // res1.shadowColor = "#ddf";
    // res1.shadowBlur = 25;
    res1.font = " 50px serif";
    res1.strokeText(0,256,40);


    const res2 = canvas.getContext("2d");
    res2.strokeStyle = "green";
    // res2.shadowColor = "#ddf";
    // res2.shadowBlur = 25;
    res2.font = "50px serif";
    res2.strokeText(1,768,40);

    const ball = canvas.getContext("2d");
    ball.strokeStyle = "yellow";
    // ball.fillStyle = ("yellow");
    // ball.shadowColor = "#ddf";
    // ball.shadowBlur = 25;
    ball.roundRect(600, 250, 23, 23, [55]);
    ball.stroke();

    const line = canvas.getContext("2d");
    line.strokeStyle = "white";
    line.globalAlpha = 0.7;
    // line.fillRect(5, 5, 210, 100);
    // line.shadowColor = "#ddf";
    // line.shadowBlur = 25;
    line.strokeRect(512,0,0,576);

    setCanvasContext1(context1);
    setCanvasContext2(context2);
	}, []);
  return (
    <div>
      <canvas ref={canvasRef}
            width="1024"
            height="576"
            style={{ border: "2px solid blue" }}
            />
    </div>
  );
};

export default Game;
/*
destructing
usestate
useref
useEffect

let i = 0
const [name, setName] = useState("");

*/