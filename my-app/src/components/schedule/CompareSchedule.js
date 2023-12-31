import React, { useState, useEffect } from 'react';
import Banner from '../Banner';
import CryptoJS from 'crypto-js';
import Button from '../buttons/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import TimeLine from '../TimeLine';
import "../../index.css";
import "../../styles/CompareSchedule.css"
import CheckIcon from '@mui/icons-material/Check';
import UpdateIcon from '@mui/icons-material/Update';
import { useLocation, useNavigate } from 'react-router-dom';


function CompareSchedule() {
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [oldSchedule, setOldSchedule] = useState('');
  const [newSchedule, setNewSchedule] = useState("");
  
 
  useEffect(() => {
    // Fetch the HTML file and set its content to the state
    fetch('./old_course.html')
      .then(response => response.text())
      .then(content => {
        setOldSchedule(content);
        console.log(content);
      });
  }, []);

  useEffect(() => {
    // Fetch the HTML file and set its content to the state
    fetch('./modified_course.html')
      .then(response => response.text())
      .then(content => {
        setNewSchedule(content);
        console.log(content);
      });
  }, []);


  
  const fullText = "What would you like to update about the new calendar?";
  const text = "Update the new schedule with custom modifications or confirm the new schedule.";
 
  const handleClick = async () => {
    console.log('Button clicked');
    var key = await postRequest();
    console.log(key);
    navigate("/shared", { state: { key, classWebsite, courseWebsite, uploadData, department, semester, year, newCode: newSchedule } });
  };

  function generateUniqueKey(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    let key = '';

    const wordArray = CryptoJS.lib.WordArray.random(length);

    // Convert the WordArray to a string using your character set
    for (let i = 0; i < wordArray.words.length; i++) {
        const word = wordArray.words[i];
        // Use 4 bytes of each word, as WordArray.random() provides 32 bits of randomness per word
        for (let j = 0; j < 4 && key.length < length; j++) {
            const byte = (word >> (8 * j)) & 0xFF;
            key += characters.charAt(byte % characters.length);
        }
    }

    return key;
}



  const postRequest = async () => {
    console.log('Button clicked');
  
    // Dummy data
    var key = generateUniqueKey(33);
    const postData = {
      ID: key,
      OldSchedule: oldSchedule,
      NewSchedule: newSchedule,
      Code: '10',
      Semester: semester,
      Department: department,
      Time: new Date(),
      MasterCalendar: 'SampleMasterCalendar.ics',
      Files: uploadData,
      ClassWebsite: classWebsite,
      CourseWebsite: courseWebsite,
      Year: year
    };
  
    try {
      const response = await fetch('http://localhost:3001/addLogistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send data.');
      }
  
      console.log(data);
      return key;
    } catch (err) {
      console.error('There was an error:', err);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const navigateBack = () => {
    window.history.back()
  }

  var { classWebsite, courseWebsite, uploadData, department, semester, year } = location.state;

  console.log(classWebsite);

  useEffect(() => {
    let i = -1;
    if (confirmClicked && i < fullText.length) {
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText((prevText) => prevText + fullText.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30);
      return () => clearInterval(typingInterval);
    }
  }, [confirmClicked]);

  const handleUpdateClick = () => {
    setConfirmClicked(true);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="App container-fluid">
      <div className="d-flex align-items-center px-4 py-2">
          <Button onClick={navigateBack} icon={<ArrowBackIcon />} text={"Back"} />
      </div>
      <Banner text={text}/>
      <TimeLine page={2}/>

      <div className="d-flex justify-content-center mt-3">
          <div className="col">
              {/* Input Schedule */}
              <div className="d-flex flex-column align-items-center" style= {{paddingLeft: "30px"}}>
                  <div className="text-white table-responsive overflow-auto" style={{backgroundColor: "white", maxHeight: '500px', maxWidth: "90%"}} dangerouslySetInnerHTML={{ __html: oldSchedule }} />
                  <h1 className="text-warning text-center mt-2.5">{semester} {year - 1} Input Schedule</h1>
              </div>
          </div>

          <div className="col">
              {/* Generated Schedule */}
              <div className="d-flex flex-column align-items-center" style= {{paddingRight: "30px"}}>
                  <div className="text-white table-responsive overflow-auto" style={{backgroundColor: "white", maxHeight: '500px', maxWidth: "90%"}} dangerouslySetInnerHTML={{ __html: newSchedule }} />
                  <h1 className="text-warning text-center mt-2.5">{semester} {year} Generated Schedule</h1>
              </div>
          </div>
      </div>

      {/* Confirm */}

      {confirmClicked && (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{padding: "10px"}}>
          <h2 className="text-warning mb-4">{displayedText}</h2>
          <textarea
            className="form-control w-50"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Paste your text here"
            style={{height: '10rem'}}
          />
          <div style={{padding: "10px"}}>
           {confirmClicked && userInput.length > 0 && 
               <Button onClick={handleClick} icon={<CheckIcon />} text={"Confirm"}/>
           }
          </div>
        </div>
      )}

<div className="d-flex justify-content-center my-4">
    <div className="pe-4">
        <Button onClick={handleUpdateClick} icon={<UpdateIcon />} text={"Update"}/>
    </div>
    <Button onClick={handleClick} icon={<CheckIcon />} text={"Confirm"}/>
</div>


      
    </div>
);

}

export default CompareSchedule;
