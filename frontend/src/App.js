

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [skills, setSkills] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please upload a file.');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

          // const res = await axios.post('http://localhost:5050/extract-skills', formData);

  try {
  const res = await axios.post('http://localhost:5050/extract-skills', formData);
  setSkills(res.data.skills || []);
} catch (err) {
  console.error(err);
  alert('Skill extraction failed.');
}

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Resume Skill Extractor</h2>

      <label htmlFor="file-upload" className="custom-file-upload">
        {file ? file.name : 'Choose Resume PDF'}
      </label>
      <input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Skills'}
      </button>

      <div className="skills">
        {skills.length === 0 && !loading && <p>No skills extracted yet.</p>}
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag animate">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
