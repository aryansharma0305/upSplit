



import React, { use } from 'react';
import { Rive,useResizeCanvas,useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Navigate, useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

const RiveButton = (props) => {

  useEffect(() => {
    AOS.init({ once: false, duration: 800, offset: -100 });
    
  }, []);


  const Navigate=useNavigate();
  
  const { rive, RiveComponent } = useRive({
                                          src: '/rive/clickable_button.riv',
                                          autoplay: true,
                                          stateMachines: 'State Machine 1',
                                          onStateChange: (stateMachine) => {
                                            StateChangehandler(stateMachine)
                                          },
                                          
  });




  const StateChangehandler = (stateMachine) => {

    if(stateMachine.data[0]==="click Off") setTimeout(()=>{Navigate("/dashboard")},300)

  }


  return (
    <div style={{height:props.height , width:props.width , verticalAlign:"center" }} className='cursor' sdata-aos="zoom-in" >
    <RiveComponent/>
    </div>
  );
};

export default RiveButton;


















