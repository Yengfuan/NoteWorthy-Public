import React, {memo} from 'react';
import Svg, { Rect, Text, Image as SvgImage, Circle, Line } from 'react-native-svg';
import JianpuNoteSVG from './JianpuNote';

const heightOfNote = (note, index) => {
  if (index === 0) {
    return 25 + note.dotsAbove * 8;
  } else {
    return 25 + note.dotsAbove * 8 + note.dotsBelow * 8;
  }
}
  

const JianpuChord =  ({ notes = [], underline = 0}) => {
  const width = notes[0].num === "MMR" ? 170 : 50
  const height = 170;

  const lowerDots = notes[0] ? notes[0].dotsBelow : 0;


  const heightArray = notes.map((note,index) => heightOfNote(note, index));
  return (
    <Svg width={width} height={height}>
      {notes[0].num === "MMR" ? (
        <>
          <Rect
            x="10"
            y="80"
            width="150"
            height="5"
            fill="black"
          />
          <Line
            x1="10"
            y1="65"
            x2="10"
            y2="100"
            stroke="black"
            strokeWidth="2"
          />
          <Line
            x1="160"
            y1="65"
            x2="160"
            y2="100"
            stroke="black"
            strokeWidth="2"
          />
          <Text
            x="85"
            y="70"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
          >
            {underline} {/* e.g., number of bars rested */}
          </Text>
        </>
      ) : (
        <>
          {notes.map((note, index) => (
            <JianpuNoteSVG
              key={index}
              num={note.num}
              isSharp={note.isSharp}
              isFlat={note.isFlat}
              octaveDotAbove={note.dotsAbove}
              octaveDotsBelow={index === 0 ? 0 : note.dotsBelow}
              dotted={note.dotted}
              x={0}
              y={100 - heightArray.slice(0, index).reduce((acc, curr) => acc + curr, 0)}
            />
          ))}
  
          {Array.from({ length: underline }, (_, i) => (
            <Line
              key={`underline-${i}`}
              x1="2"
              y1={132 + (i * 4)}
              x2="48"
              y2={132 + (i * 4)}
              stroke="black"
              strokeWidth="1.5"
            />
          ))}
  
          {Array.from({ length: lowerDots }, (_, i) => (
            <Circle
              key={`below-${i}`}
              cx="26.5"
              cy={136 + (underline * 4) + (i * 8)}
              r="2.5"
              fill="black"
            />
          ))}
        </>
      )}
    </Svg>
  );
};

export default memo(JianpuChord);