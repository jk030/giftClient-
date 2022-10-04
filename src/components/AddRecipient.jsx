import { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom"

import axios from "axios";


function AddRecipient(props) {
 
  const [ name, setName ] = useState("");
  const [ personalDetails, setPersonalDetails ] = useState("");
  const [ preferences, setPreferences ] = useState("");
  const [ unwanted, setUnwanted ] = useState("");
  const [ imageRecipient, setImageRecipient ] = useState("");

  const { user } = useContext(AuthContext)

  const { getUserInfo } = props;

  const handleSubmit = (e) => {
    e.preventDefault();

  
    const requestBody = { name, personalDetails, preferences, unwanted, userId: user._id, userName: user.userName, imageRecipient }

    const storedToken = localStorage.getItem("authToken");

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/recipients`, requestBody, {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(async (response) => {

        await getUserInfo();
        setName("")
        setPersonalDetails("")
        setPreferences("")
        setUnwanted("")
      })

      .catch((error) => console.log(error))
  }
  
//console.log("these are the props",props)
  
  return (
    <div className="AddRecipient">
      <h3>Add Recipient</h3>
      

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name:</label>

      <form onSubmit={handleSubmit}>
        <label className="Details2" >Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="Details2" >Personal Details:</label>
        <input
          type="text"
          name="personalDetails"
          value={personalDetails}
          onChange={(e) => setPersonalDetails(e.target.value)}
        />

        <label className="Details2" >Preferences:</label>
        <input
          type="text"
          name="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />

        <label>Things they don't want:</label>
        <textarea
        <label className="Details2" >Things they dont want:</label>
        <input
          type="text"
          name="unwanted"
          value={unwanted}
          onChange={(e) => setUnwanted(e.target.value)}
        />

        <label>Upload image</label>
        <input
          type="file"
          name="imageRecipient"
          value={imageRecipient}
          onChange={(e) => setImageRecipient(e.target.value)}
        />

        <Link to="/profilePage">
          <button>Go Back</button>    
        </Link>
        <button type="submit">Save</button>
        <button className="signUpbtn" type="submit">Save</button>
        
      </form>
    </div>
  );
}

export default AddRecipient;