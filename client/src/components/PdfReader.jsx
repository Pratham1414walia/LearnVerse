// Your React component
import React from 'react';
import { useState } from 'react';
import axios from 'axios';



function PdfReader() {
  const[pdfdata,setPdfData] = useState("");
  async function showResult() {
    try {
      const response = await axios.get('http://localhost:5000/child');
      // Assuming response.data contains the PDF data or the data you want to set
      setPdfData(response.data);
      console.log(response.data);
  } catch (error) {
      console.error('Error:', error);
  }
    }

  const handleSubmit=()=>{
    showResult();
   }
//    function createCard(data) {
//     return (
//         <div key={data.palce_id}>
//             <h1>{data.name}</h1>
//             <p>Address: {data.formatted_address}</p>
//             <p>Rating: {data.rating}</p>
//         </div>
//     );
// }
  return (
 <>
    <h1>Ask Questions from PDF</h1>
    <h3>{pdfdata}</h3>
    <input type="text" className="input-area"      
      />
    <button onClick={handleSubmit} className="button">Submit</button>
    <button  className="button">Upload</button>
 </>
  );
}

export default PdfReader;
