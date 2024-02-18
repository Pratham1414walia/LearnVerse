import React, { useRef, useState } from 'react'
import "./QuizPage.css"
import { quizData } from './quizData'; 
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
function QuizPage() {
    // console.log(data);
    const data= quizData.Questions;
     console.log(data);
    const [index,setIndex]=useState(0);
    const [curQ,setcurQ]=useState(data[index]);
    const [lock,setLock]=useState(false); 
    const [score,setScore]=useState(0);
    const [correctAns,setCorrectAns]=useState(0);
    const [wrongAns,setWrongAns]=useState(0);
    const [endPage,setEndPage]=useState(false);
    const option1=useRef(null);
    const option2=useRef(null);
    const option3=useRef(null);
    const option4=useRef(null);
   
    const option_array=[option1,option2,option3,option4]; 
    const next=()=>{
      if(lock==true){
   
         if(index===data.length-1){
            setEndPage(true);

         }


       setIndex((index)=>index+1);
       setcurQ(data[index]);
       setLock(false);
     
        option_array.map((option)=>{
         option.current.classList.remove("Wrong");
         option.current.classList.remove("Correct");
        })
   
      }
   
    
    }
   
    const checkAns=(e,curOption,optionNo)=>{
     
       if(lock==false){
         if(curQ.Correct_Answer===curOption){
           e.target.classList.add("Correct");
           setScore(score=>score+1); 
           setCorrectAns(correctAns=>correctAns+1);
         }
        else{
          setWrongAns(wrongAns=>wrongAns+1);
         curQ.Options.map((option,idx)=>{
             
            if(option===curQ.Correct_Answer){
             option_array[idx].current.classList.add("Correct"); 
            }
            
          })
   
         e.target.classList.add("Wrong");
        }
        setLock(true);
       }
      
    }
   

  return (
    <>

<div className='container'>

 {endPage?<>
   <h1>Total Score :{score}</h1>
   <h1>Correct answers :{correctAns}</h1>
  <h1>Wrong answers:{wrongAns}</h1>

  <Link to="/ContentPage">
          <button type='button' className="button">Reset</button>
        </Link>
      
 </>:<>
 <h1>Q{index+1} : {curQ.Question}</h1>
 <hr />
 <ul >
  <li ref={option1} onClick={(e)=>checkAns(e,curQ.Options[0],0)}>{curQ.Options[0]}</li>
  <li ref={option2} onClick={(e)=>checkAns(e,curQ.Options[1],1)}>{curQ.Options[1]}</li>
  <li ref={option3} onClick={(e)=>checkAns(e,curQ.Options[2],2)}>{curQ.Options[2]}</li>
  <li ref={option4} onClick={(e)=>checkAns(e,curQ.Options[3],3)}>{curQ.Options[3]}</li>
 </ul>
<button onClick={next} >Next</button>
 
 </>}

</div>

    </>
  )
}

export default QuizPage