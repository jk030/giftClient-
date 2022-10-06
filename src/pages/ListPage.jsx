import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect , useContext} from "react"
import axios from "axios";
import AddGift from "../components/AddGift"
import { AuthContext } from "../context/auth.context";
import service from "../service.js";

//import { Button } from "react-router-dom";
    
function ListPage (props) {
   const { user } = useContext(AuthContext)
 //  console.log("this is the user",user)
    const { recipientId } = useParams();
    const [recipientInfo, setRecipientInfo] = useState({})
    // const [giftDetails, setGiftDetails] = useState({})
    //const [recipientGifts, setRecipientGifts] = useState ([])
    const [ name, setName ] = useState("");
    const [ personalDetails, setPersonalDetails ] = useState("");
    const [ preferences, setPreferences ] = useState("");
    const [ unwanted, setUnwanted ] = useState("");

    const [privacy, setPrivacy] = useState(true)

    const [ imageRecipient, setImageRecipient ] = useState("");
    // const [ imageGift, setImageGift ] = useState("")
    // handles cancel button
    const [ inputValue, setInputValue ] = useState("Value from onChange")


    const [edit,setEdit] = useState (true) //use the setEdit only when logged in 

    const handleRecipientFileUpload = (e) => {
        console.log("The file to be uploaded is: ", e.target.files[0]);
     
        const uploadData = new FormData();
     
        // imageUrl => this name has to be the same as in the model since we pass
        // req.body to .create() method when creating a new movie in '/api/movies' POST route
        uploadData.append("imageRecipient", e.target.files[0]);
      
        service
          .uploadImage(uploadData)
          .then(response => {
            console.log("response is: ", response);
            // response carries "fileUrl" which we can use to update the state
            setImageRecipient(response.fileUrl);
          })
          .catch(err => console.log("Error while uploading the file: ", err));
      };

    const handleCancel = () => {
        setInputValue("")
    }
    
    const [edit,setEdit] = useState (true) //use the setEdit only when logged in 

    const getRecipientInfo = () => {
        axios
        .get(`${process.env.REACT_APP_API_URL}/api/recipients/${recipientId}`)
        .then((response) => {
          const recipientDetails = response.data;
        //   console.log(recipientDetails)
          setRecipientInfo(recipientDetails)
          })
        .catch((error) => console.log(error));
    };
  

    useEffect(() => {
      getRecipientInfo();

    }, [] );


    

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestBody = { name, personalDetails, preferences, unwanted, imageRecipient, privacy };

        
        axios
        // TODO: will need to check the get route i.e. listPage OR recipientPage 
            .put(`${process.env.REACT_APP_API_URL}/api/recipients/${recipientId}`, requestBody)
            .then((response) => {
                // might need an async await here
                getRecipientInfo()
                setEdit(true)
            });
    };


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/recipients/${recipientId}`)
            .then((response) => {
                const oneRecipient = response.data;
                setName(oneRecipient.name);
                setPersonalDetails(oneRecipient.personalDetails);
                setPreferences(oneRecipient.preferences);
                setUnwanted(oneRecipient.unwanted);
                setPrivacy(oneRecipient.privacy)
            })
            .catch((error) => console.log(error));
            // eslint-disable-next-line
    }, []);


//--> delete gift route
    const deleteGift = (giftId) => {
        console.log(giftId)
        axios
        .delete(`${process.env.REACT_APP_API_URL}/api/gifts/${giftId}`)
        .then(() => {
            getRecipientInfo()
        })
        .catch((err) => console.log(err));

    };



if(user === null) {
    return <p>Loading...</p>
}

return (
    <div className="list">

    
    {edit?
     <div className="ContainerRecipientDetailsListPage"> 
        <h2>{recipientInfo.name}</h2>
        <img src={recipientInfo.imageRecipient} alt="Recipient" width={200}/>
        <p>{recipientInfo.personalDetails}</p>
        <article>{recipientInfo.preference}</article>
        <article>{recipientInfo.unwanted}</article>
        {privacy ?<p>This List is Public</p> : <p>This list is Private</p>}
        {edit && user._id === recipientInfo.user &&  <button onClick={()=> setEdit(false)}>Edit this Recipient</button> }
    </div>  :        
    
        <form onSubmit={handleSubmit}>
                <label>Upload Image:</label>
                <input
                type="file"
                name="imageRecipient"
                onChange={(e) => handleRecipientFileUpload(e)}
                />
                
                <label>Name:</label>
                <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <label>Personal Details:</label>
                <textarea
                type="text"
                name="personalDetails"
                value={personalDetails}
                onChange={(e) => setPersonalDetails(e.target.value)}
                />

                <label>Preferences:</label>
                <textarea
                type="text"
                name="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                />

                <label>Add Past Gifts:</label>
                <textarea
                type="text"
                name="unwanted"
                value={unwanted}
                onChange={(e) => setUnwanted(e.target.value)}
                />
                {privacy ?<button type="button" onClick={()=> setPrivacy(false)}>Set list to private</button> : <button type="button" onClick={()=> setPrivacy(true)}>Set list to public</button>}
                <button type="submit" >Update Recipient</button>

                <button type="submit" onClick={handleCancel} value={inputValue}>Cancel</button>
                {/* <button onClick={deleteRecipient}>Delete Recipient</button> */}

            </form>
    }


    <ul> 
    {recipientInfo?.gifts?.length !== 0 && recipientInfo?.gifts?.map(gift => {
        return <li key={gift._id}>
        {/* {console.log(gift)} */}
                    <h2>{gift.title}</h2> 
                    {/* TODO: find source of imageGift */}
                    <img src={gift.imageGift} alt="Gift"/>
                    <p>{gift.priceSpan}</p> 
                    <a href={gift.link}><p>Link</p></a>
                    <p>{gift.occasion}</p>
                    <p>{gift.notes}</p>
                    {user._id === recipientInfo.user &&  <button onClick={()=> deleteGift(gift._id) }>Delete</button>}
                </li>
                
    })}
    </ul>

    {user._id === recipientInfo.user &&
        <div className="ContainerAddGift">
                <AddGift recipientId={recipientId}  getRecipientInfo={getRecipientInfo}/>
        </div>
    }


  
    </div>
    )
}

export default ListPage 



//  {Object.entries(recipientInfo.gift).map(allGifts => {
//                 console.log("this is the ", recipientInfo.gift)
//             return (
//                 <div>
//                 {!allGifts ? <></> : <>
//             <h2>{allGifts[0].title}</h2> 
//             <h2> {allGifts[0].occasion}</h2>
//             </>}
//                 </div>
//             )
//         })}