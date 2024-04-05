import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Chart from 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    ethnicity: '',
    education: '',
    smokerType: '',
    lungDisease: '',
    familyHistory: ''
  });
  const [riskData, setRiskData] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [resetModalIsOpen, setResetModalIsOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleCalculateRisk = async () => {
    toast.info('Calculating...');
    const riskData = {
      labels: ['Smoker Risk', 'Non-Smoker Risk'],
      datasets: [{
        label: 'Risk %',
        data: [calculateSmokerRisk(), calculateNonSmokerRisk()],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    };
    console.log('Risk Data:', riskData);
    setRiskData(riskData);
    setShowSummary(true);
  };
 

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/form', formData);
      toast.success('Form submitted successfully!');
      console.log('Form data submitted successfully!');
    } catch (error) {
      toast.error('Error submitting form. Please try again later.');
      console.error('Error submitting form data:', error);
    }
  };
  
  
  const calculateSmokerRisk = () => {
   
    
    const { age, height, weight } = formData;
    const smokerRisk = ((age * 0.5) + (height * 0.2) - (weight * 0.1)); 
    return smokerRisk;
  };
  
  
  const calculateNonSmokerRisk = () => {
   
    
    const { age, height, weight } = formData;
    const nonSmokerRisk = ((age * 0.3) + (height * 0.1) - (weight * 0.05)); 
    return nonSmokerRisk;
  };
  const handleReset = () => {
    setResetModalIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      age: '',
      gender: '',
      height: '',
      weight: '',
      ethnicity: '',
      education: '',
      smokerType: '',
      lungDisease: '',
      familyHistory: ''
    });
    setShowSummary(false);
    setRiskData({});
    setResetModalIsOpen(false);
  };

  const handleSaveSummary = async () => {
    try {
      const response = await axios.post('https://backend-9avl.vercel.app/api/saveSummary/pdf', { formData, riskData }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.pdf');
      document.body.appendChild(link);
      link.click();
      toast.success('Download pdf  successfully!');
    } catch (error) {
      toast.success('Failed');
      console.error('Error saving summary:', error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post('https://backend-9avl.vercel.app/api/saveSummary/csv', { formData, riskData });
      const csvData = response.data;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.csv');
      document.body.appendChild(link);
      link.click();
      toast.success('Downloaded csv successfully!');
    } catch (error) {
      toast.warn('Errorr didnt download ');
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div className="container">
    <h1>Lung Cancer Risk Assessment</h1>
    {!showSummary && (
      <form className="form">
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (cm):</label>
          <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg):</label>
          <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="ethnicity">Ethnicity:</label>
          <input type="text" id="ethnicity" name="ethnicity" value={formData.ethnicity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="education">Education:</label>
          <select id="education" name="education" value={formData.education} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="High School">High School</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="smokerType">Smoker Type:</label>
          <select id="smokerType" name="smokerType" value={formData.smokerType} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Current Smoker">Current Smoker</option>
            <option value="Former Smoker">Former Smoker</option>
            <option value="Never Smoked">Never Smoked</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="lungDisease">Lung Disease History:</label>
          <select id="lungDisease" name="lungDisease" value={formData.lungDisease} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="familyHistory">Family History of Lung Cancer:</label>
          <select id="familyHistory" name="familyHistory" value={formData.familyHistory} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
        <button type="button" className="btn-submit" onClick={handleSubmit}>Submit</button>
      </form>
    )}
    {showSummary && (
      <div className="summary">
        <h2>Summary</h2>
        <div className="summary-data">
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Height:</strong> {formData.height} cm</p>
          <p><strong>Weight:</strong> {formData.weight} kg</p>
          <p><strong>Ethnicity:</strong> {formData.ethnicity}</p>
          <p><strong>Education:</strong> {formData.education}</p>
          <p><strong>Smoker Type:</strong> {formData.smokerType}</p>
          <p><strong>Lung Disease History:</strong> {formData.lungDisease}</p>
          <p><strong>Family History of Lung Cancer:</strong> {formData.familyHistory}</p>
        </div>
        <div className="risk-chart">
          <h3>Risk Data</h3>
          <Bar data={riskData} />
        </div>
        <div className="buttons">
          <button type="button" className="btn-save" onClick={handleSaveSummary}>Save Summary</button>
          <button type="button" className="btn-download" onClick={handleDownloadCSV}>Download CSV</button>
        </div>
      </div>
    )}
   <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
      <Modal
        isOpen={resetModalIsOpen}
        onRequestClose={() => setResetModalIsOpen(false)}
        contentLabel="Reset Modal"
        className="modal"
        overlayClassName="overlay"
        
        style={{
          content: {
            position:'absolute',
            background:'White',
            textAlign:"center",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%', // Adjust the width as needed
            maxWidth: '400px' // Set max-width if needed
          }
        }}
      
      >
        <h2>Are you sure you want to reset?</h2>
        <div className="modal-buttons">
          <button className="btn-save" onClick={resetForm}>Yes</button>
          <button className="btn-reset" onClick={() => setResetModalIsOpen(false)}>No</button>
        </div>
      </Modal>
      <ToastContainer />
  </div>
  

  );
}

export default App;
