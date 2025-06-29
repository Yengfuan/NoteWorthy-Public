import React from 'react';
import { View } from 'react-native';
import Svg, {  Image as SvgImage, Circle, Line, G} from 'react-native-svg';


const JianpuNoteSVG = React.memo(({ num = "1", isSharp = false , isFlat = false , octaveDotAbove = 0 , octaveDotsBelow = 0, dotted = 0, x = 0, y = 0}) => {
 const convertToImage = (int) => { 
          const imageMap = {
            "0" : require('../../assets/0.png'),
            "1" : require('../../assets/1.png'),
            "2" : require('../../assets/2.png'),
            "3" : require('../../assets/3.png'),
            "4" : require('../../assets/4.png'),
            "5" : require('../../assets/5.png'),
            "6" : require('../../assets/6.png'),
            "7" : require('../../assets/7.png'),
            "dash" : require('../../assets/dash.png'),
          }
  
          if (imageMap[int]) {
            return imageMap[int];
          } else {
            console.warn(`No image found for key: ${int}`);
            return null;
          }
        }
  

  return (
    <G transform={`translate(${x}, ${y})`}>
      {isSharp && (
        <SvgImage 
        href = {require('../../assets/sharp.png')}
        x="4"
        y="0"
        width="17"
        height="17"
      />
      )}

      {isFlat && (
        <SvgImage 
          href = {require('../../assets/b.png')}
          x="3"
          y={7 - (octaveDotsBelow * 8)}
          width="20"
          height="20"
        />
      )}

      {convertToImage(num) && (
        <SvgImage
          href={convertToImage(num)}
          x= "17"
          y= {8 - (octaveDotsBelow * 8)} // Adjust y position based on octave dots above
          width="17"
          height="17"
        />
      )}

      {Array.from({ length: octaveDotAbove }, (_, i) => (
        <Circle
          key={`above-${i}`}
          cx= { "26.5" } 
          cy={3 - (i * 8) - (octaveDotsBelow * 8)} // Adjust y position for each dot
          r="2.5"
          fill="black"
        />
      ))}

      {Array.from({ length: dotted }, (_, i) => (
        <Circle
          key={`dotted-${i}`}
          cx={((i-1) * 8) + 45 } // Adjust x position for each dot
          cy={ 18 - (octaveDotsBelow * 8) } // Adjust y position for each dot
          r="2.5"
          fill="black"
        />
      ))}

 

      {Array.from({ length: octaveDotsBelow }, (_, i) => (
        <Circle
          key={`below-${i}`}
          cx={"26.5"} 
          cy={20 - (i * 8) } // Adjust y position for each dot
          r="2.5"
          fill="black"
        />
      ))}

      
    </G>

  )

}
)
export default JianpuNoteSVG;