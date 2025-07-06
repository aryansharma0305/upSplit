



import React, { use } from 'react';
import { Rive,useResizeCanvas,useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Navigate, useNavigate } from 'react-router-dom';

const RiveButton = (props) => {

  useEffect(() => {
    AOS.init({ once: false, duration: 800, offset: -100 });
  }, []);


   
     const { rive, RiveComponent } = useRive({
    src: '/rive/clickable_button (2).riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
  
   
  });


  const  click= useStateMachineInput(rive, 'State Machine 1', 'click');
  const hovered= useStateMachineInput(rive, 'State Machine 1', 'hovered');
  

  const Navigate = useNavigate();

  


  return (
    <div style={{height:props.height , width:props.width , verticalAlign:"center" }} sdata-aos="zoom-in" >
    <RiveComponent 

      onMouseEnter={() => {
        hovered.value = true;

      }}

      onMouseLeave={() => {
        hovered.value = false;
      }
    }

    onMouseDown={() => {
        click.value = true;}
    }

    onMouseUp={() => {
        click.value = false;
        
      }
    }

    onMouseMove={(e) => {
       
      }
    }

   onClick={()=>{setTimeout(()=>Navigate('/dashboard'),300)}}

    />
    </div>
  );
};

export default RiveButton;


















