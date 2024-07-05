// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import Home from './Components/HomePage'
import SavedQuestion from './Components/SavedQuestion';
function App() {

  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Home" element={<Home />} />   
          <Route path="/SavedQuestion" element={<SavedQuestion />} />       
        </Routes>
      </div>
    </Router>
  );
}

export default App;
