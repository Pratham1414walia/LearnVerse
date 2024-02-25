import React from 'react'
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { useState } from 'react';
import { setQuizData,quizData } from './quizData'; 

function ContentPage() {

//  Quiz Generation
const [quizSearch,setQuizSearch]=useState("");
// const [toQuiz,setToQuiz]=useState(0);
    const [obj,setobj]=useState({"user":"Hello"});
    const [userSearch,setUserSearch]=useState("hello");
    const [content,setContent]=useState("");
    const MODEL_NAME = "gemini-pro";
    const API_KEY = "AIzaSyCaGAhM12gInhJSVkdeu6Z6oHN_EIwf9PQ";    
    async function run(userString,type) {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
   
      const parts = [{ text:  userString }];
    
      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
    
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];
    
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
    
      const response =await result.response;
      if(type==="Content"){
      
        setContent(response.text());
        // console.log(response.text());
      }
      else{
        let newString =await response.text();
    
        const cur_json=JSON.parse(newString);
    
        console.log(cur_json);
        
        setobj(cur_json);
       const content=cur_json;  

       setQuizData(cur_json);

      }
     
    }
    
    const handleSubmit=()=>{
     run(userSearch,"Content");
  
     console.log(quizSearch); 
     run(quizSearch,"Quiz")
    //  setUserSearch("");
     setQuizData(obj);
    }
   
    

  return (
    <>

     <div className='container-content'>
       <textarea  name="postContent" 
               rows={40}
               cols={40}
              value={content} // ...force the input's value to match the state variable...
              onChange={(e) => setContent(e.target.value)} 
              className="text-area"
              readOnly
            />
            <div className='input-container'>
      <input type="text" className="input-area"
        onInput={(e)=>{
          setUserSearch(e.target.value)
          setQuizSearch(`Generate 4 medium-level MCQ questions on ${e.target.value} along with options. Also, mention the correct answer at the end of all questions along with the question number. Please generate questions and answers in the JSON format given below:'Question: .....Options: ....Correct_Answer: ....'ALERT: Don't use any markdowns. Give output in JSON format. Enclose all the questions in an additional curly brace.`)
        }}      
      />

      <button 
      onClick={handleSubmit} className="button">Submit</button>

<Link to="/QuizPage">
          <button type='button' className="button">Quiz</button>
        </Link>
        </div>
</div>
    </>
  )
}


export default ContentPage;