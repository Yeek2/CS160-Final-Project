import React, { useState, useEffect, useRef } from 'react';
import Banner from '../Banner';

import LinkIcon from '@mui/icons-material/Link';
import Button from '../buttons/Button';
import placeholder from '../../assets/placeholder.png'; 
import CodeEditor from '../website/AceEditor';

import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';
import CodeIcon from '@mui/icons-material/Code';
import { useLocation, useNavigate } from 'react-router-dom';

import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import "../../index.css";

function SharedSchedule() {
  const [showEditor, setShowEditor] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [startTyping, setStartTyping] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');  // New state for copy success message
  
  const location = useLocation();
  const navigate = useNavigate();
  
  var { key, classWebsite, courseWebsite, uploadData, department, semester, year, newCode } = location.state;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedHours = hours > 12 ? hours - 12 : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const amOrPm = hours >= 12 ? 'pm' : 'am';

  const time = `${formattedHours}:${formattedMinutes}${amOrPm}`;
  const iRef = useRef(-1);

  const DisplayText = `
TTable generated at: ${time}
Class Website: ${classWebsite}
Course Website: ${courseWebsite}
`;

const fullText = DisplayText;

useEffect(() => {
  if (startTyping) {
    const typingInterval = setInterval(() => {
      if (iRef.current < fullText.length) {
        setDisplayedText((prevText) => prevText + fullText.charAt(iRef.current));
        iRef.current++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }
}, [startTyping]);

  const [language, setLanguage] = useState("javascript");
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  }
  
  const generateCalendar = () => {
    navigate("/calendar", { state: { uploadData, department, semester, year } });
  }


  const handleEditorToggle = () => {
    setShowEditor(true);
  };

  const navigateBack = () => {
    window.history.back();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopySuccess('Key Copied!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy key!');
      });
  };

  return (
    <div className="App container">

      <Button onClick={navigateBack} icon={<ArrowBackIcon />} text={"Back"}/>
      <Banner text={"Congratulations! Your new schedule has been generated. Copy the key to share this generated calendar with others. Now export the calendar in the format of your choosing!"}/>

      <div className="font-weight-bold text-white">
      <h3>
  <LinkIcon className="mr-2"/> 
  Shared key: 
  <span style={{color: "#FFB81C"}}> {key}</span>
</h3>        

        <button onClick={handleCopy} className="btn btn-primary btn-sm mr-2">
          Copy Key
        </button>
        <Tooltip title={
            <div className="text-medium">
            Share this key with your staff members to export the Google Calendar and Tasks.
            </div>
            }>
            <InfoOutlinedIcon fontSize="medium" style={{ marginLeft: '5px', cursor: 'pointer' }} />
          </Tooltip>

        {copySuccess && <div style={{color: 'green'}}>{copySuccess}</div>}
        
      </div>

      <div className="font-weight-bold text-white">{displayedText}</div>
      
      {showEditor && <select value={language} onChange={handleLanguageChange} className="form-select form-select-sm">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="markdown">Markdown</option>
      </select>}
      
      {showEditor ? <CodeEditor language={language} code={newCode} /> : 
      <div className="d-flex flex-column align-items-center" style= {{paddingRight: "30px"}}>
      <div className="text-white table-responsive overflow-auto" style={{backgroundColor: "white", maxHeight: '500px', maxWidth: "90%"}} dangerouslySetInnerHTML={{ __html: newCode }} />
      <h1 className="text-warning text-center mt-2.5">{department} {semester} {year} Generated Schedule</h1>
  </div>
      
      }

      <div className="d-flex justify-content-center align-items-center mt-4">
        <Button onClick={() => {window.open("https://drive.google.com/uc?export=download&id=1-PJK4qgJEKgGdwtTWVXbK9G3sWQs3FZ_", '_blank')}} icon={<DownloadIcon />} text={"Download master calendar .ics"} className="btn btn-secondary mr-2"/>
        <Button onClick={generateCalendar} icon={<GoogleIcon />} text={"Google Calendar & Role-based Google Tasks"} className="btn btn-secondary mr-2"/>
        <Button onClick={handleEditorToggle} icon={<CodeIcon />} text={"Website Code"} className="btn btn-secondary"/>
      </div>

    </div>
);
}

export default SharedSchedule;
