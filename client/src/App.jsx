import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TitleBar } from './Components/TitleBar';
import { Homepage } from './Components/Homepage';
import { Login } from './Components/Login';
import InitialPage from './Components/InitialPage';
import API from './API';
import { useState, useEffect } from 'react';

function App() {

  const [user, setUser] = useState(0);
  const [proposals, setProposals] = useState([{id:0, title: 'AI system research', supervisor: 'Mario Rossi', expDate: '10/1/2024', keywords: 'AI', type:'Sperimental', groups:'A32', description: 'AI thesis about...', know:'Machine learning', level:'Master', cds: 'LM_31', creatDate:'10/1/2023', status: '1'}]);
  const [page, setPage] = useState(-1);
  const [isAuth, setIsAuth] = useState(0);
  const [active, setActive] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());  


  useEffect(() => {
    API.advancedSearchThesis({page: active}).then(res=>{
      setProposals(res[1]);
      setPage(res[0]);
    });
   //proposals.map(e=>console.log(e));
  }, [user, isAuth]);

    return (
        <>
        <BrowserRouter>
          <Routes>
          <Route path='/'element={<InitialPage setIsAuth={setIsAuth} isAuth={isAuth} user={user} setUser={setUser}/>}/>
          <Route path='/home' element={<><Homepage setIsAuth={setIsAuth} isAuth={isAuth} pages={page} user={user} setUser={setUser}
          proposals={proposals} setProposals={setProposals} setPages={setPage} active={active} setActive={setActive} currentTime={currentTime}
          setCurrentTime={setCurrentTime}/></>} />
          <Route path='/login'element={<Login user={user} setUser={setUser} setIsAuth={setIsAuth}></Login>}/>
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;