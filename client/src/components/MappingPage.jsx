// Your React component
import React from 'react';
import { useState } from 'react';
 
function MappingPage() {
    const[mapData,setMapData] = useState("");
    const [location,setLocation]=useState("");
    async function showMap() {
      try {
        const response = await fetch(`http://localhost:5000/maps/${location}`);
        const data = await response.json();
        //console.log(data.results); // Process the fetched data here
        setMapData(data.results);
      } catch (error) {
        console.error('Error:', error);
      }
    }

  const handleSubmit=()=>{
    showMap();
   }
   function createCard(data) {
    // const linkData = data.photos[0].html_attributions;
    // const link = linkData.getElementById("aaa").getAttribute("href");
    return (
        <div key={data.palce_id}>
            <h1>{data.name}</h1>
            <p>Address: {data.formatted_address}</p>
            <p>Rating: {data.rating}</p>
            {/* <a href={link}>Link</a> */}
        </div>
    );
}
  return (
 <>
<div>
  <h1>Search for classes near you</h1>
       <input type="text" className="input-area"
                onInput={(e)=>setLocation(e.target.value)}
         />
           <button onClick={handleSubmit} className="button">Submit</button>
      {mapData?.length ?(mapData.map(createCard)
 
 ) : (
   <>
           </>
          )
        }

    </div>
 </>
  );
}

export default MappingPage;
