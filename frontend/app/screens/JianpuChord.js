import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text, Image as SvgImage, Circle, Line } from 'react-native-svg';
import JianpuNoteSVG from './JianpuNote';

const heightOfNote = (note, index) => {
  if (index === 0) {
    return 25 + note.dotsAbove * 8;
  } else {
    return 25 + note.dotsAbove * 8 + note.dotsBelow * 8;
  }
}
  





const JianpuChord = ({ notes = [], underline = 0}) => {
  const width = 50;
  const height = 170;

  const lowerDots = notes[0] ? notes[0].dotsBelow : 0;


  const heightArray = notes.map((note,index) => heightOfNote(note, index));
  return (
    <Svg width={width} height={height}>

      {notes.map((note, index) => (
        <JianpuNoteSVG
          key={index}
          num={note.num}
          isSharp={note.isSharp}
          isFlat={note.isFlat}
          octaveDotAbove={note.dotsAbove}
          octaveDotsBelow={index == 0 ? 0 : note.dotsBelow}
          dotted={note.dotted}
          x={0}
          y = {100 - heightArray.slice(0, index).reduce((acc, curr) => acc + curr, 0)} // Adjust y position for each note
        />
      ))}

      {Array.from({ length: underline }, (_, i) => (
        <Line
          key={`underline-${i}`}
          x1="2"
          y1={132 + (i * 4)} // Adjust y position for each line
          x2="48"
          y2={132 + (i * 4)} // Adjust y position for each line
          stroke="black"
          strokeWidth="1.5"
        />
      ))} 

      {Array.from({ length: lowerDots }, (_, i) => (
        <Circle
          key={`below-${i}`}
          cx={"26.5"} 
          cy={150 - (i * 8) } // Adjust y position for each dot
          r="2.5"
          fill="black"
        />
      ))}



    </Svg>
  );
};

export default JianpuChord;