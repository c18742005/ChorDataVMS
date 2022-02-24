import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import { Box, Grommet, Heading } from 'grommet';
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import theme from './theme'

import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import SideBar from "./components/SideBar";
import AppBar from "./components/AppBar";
import Client from "./pages/Client";
import Patient from "./pages/Patient";

function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  // Check if the staff member has authenticated
  const checkAuthenticated = async () => {
    try {
      axios.get(`${process.env.REACT_APP_API_END_POINT}/api/verify`, {
        headers: {
          'token': localStorage.token
        }
      })
        .then(res => {
          const parseRes = res.data;
          parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <Grommet theme={theme} full>
      <ToastContainer />
      <Box fill 
        align="start" 
        direction="row" 
        justify="start" 
        gap="none"
      >
        {menuOpen ? (
          <Box align="stretch" justify="center" fill="vertical">
            <SideBar />
          </Box>) : 
          (<></>)
        }
        
        <Box align="center" justify="start" direction="column" fill>
          <Box align="center" justify="start" direction="column" gap="none" fill>
            <AppBar handleMenu={handleMenu} menuOpen={menuOpen} setAuth={setAuth} isAuth={isAuthenticated}/>
            <Box align="start" justify="start" direction="column" pad="medium" fill>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/client/:clientId" element={<Client />} />
                <Route path="/patient/:patientId" element={<Patient />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register setAuth={setAuth} />} />
                <Route path="*" element={<Box><Heading level={3}>There's nothing here: 404!</Heading></Box>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
      {console.log(process.env.REACT_APP_API_END_POINT)}
    </Grommet>
  );
}

export default App;
