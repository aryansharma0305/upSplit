



import React from 'react';
import { Rive,useResizeCanvas,useRive } from '@rive-app/react-canvas';

const RiveSplitAnim = (props) => {
   
     const { rive, RiveComponent } = useRive({
    src: '/rive/split.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    
    
  });

  return (
    <div >
    <RiveComponent style={{height:props.height , width:props.width , verticalAlign:"center" }}  />
    </div>
  );
};

export default RiveSplitAnim;


