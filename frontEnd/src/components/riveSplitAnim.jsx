



import React from 'react';
import { Rive,useResizeCanvas,useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

const RiveSplitAnim = (props) => {

  useEffect(() => {
    AOS.init({ once: false, duration: 800, offset: -100 });
  }, []);
   
     const { rive, RiveComponent } = useRive({
    src: '/rive/split.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    
    
  });

  return (
    <div >
    <RiveComponent style={{height:props.height , width:props.width , verticalAlign:"center" }} data-aos="fade-up"  />
    </div>
  );
};

export default RiveSplitAnim;


