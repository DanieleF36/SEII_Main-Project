import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TitleBar } from './Components/TitleBar';
import { Homepage } from './Components/Homepage';
import API from './API';
import { useState, useEffect } from 'react';

function App() {

  const [user, setUser] = useState(0);

  useEffect(() => {
   
  }, [user]);

    return (
        <>
        <BrowserRouter>
          <Routes>
          <Route path='/' element={<><TitleBar user={user} setUser={setUser}/><Homepage user={user}/></>} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;