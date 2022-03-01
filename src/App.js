import { Navigate, Routes, Route } from "react-router-dom";
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
import Drugs from "./pages/Drugs";

function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  // Check if the staff member has authenticated
  const checkAuthenticated = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_END_POINT}/api/verify`, {
        headers: {
          'token': localStorage.token
        }
      })
        .then(res => {
          const parseRes = res.data;
          parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        })
        .catch(e => console.log(e.response.data))
    } catch (err) {
      console.error(err.message);
    }
  };

  // Retrieve staff user info from api
  const retrieveUser = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_END_POINT}/api/staff`, {
        headers: {
          'token': localStorage.token
        }
      })
        .then(res => {
          setUser(res.data)
        })
        .catch(e => console.log(e.response.data))
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
    retrieveUser();
  }, [isAuthenticated]);

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
        { isAuthenticated && (
          menuOpen && (
          <Box align="stretch" justify="center" fill="vertical">
            <SideBar isAuth={isAuthenticated} />
          </Box>
        ))}
        
        <Box align="center" justify="start" direction="column" fill>
          <Box align="center" justify="start" direction="column" gap="none" fill>
            <AppBar 
              handleMenu={handleMenu} 
              menuOpen={menuOpen} 
              setAuth={setAuth} 
              isAuth={isAuthenticated}
              user={user.staff_username}
              setUser={setUser}
            />
            <Box align="start" justify="start" direction="column" pad="medium" fill>
              <Routes>
                <Route path="/login" element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Login setAuth={setAuth} isAuth={isAuthenticated} />
                  )}  
                />
                <Route path="/register" element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Register setAuth={setAuth} />
                  )} 
                />
                <Route path="/" element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" />
                  )}  
                />
                <Route path="/clients" element={
                  isAuthenticated ? (
                    <Clients clinic={user.staff_clinic_id} />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                <Route path="/client/:clientId" element={
                  isAuthenticated ? (
                    <Client />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                <Route path="/patient/:patientId" element={
                  isAuthenticated ? (
                    <Patient />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="/drugs" element={
                  isAuthenticated ? (
                    <Drugs 
                      clinic_id={user.staff_clinic_id} 
                      staff_id={user.staff_member_id}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="*" element={<Box><Heading level={3}>There's nothing here: 404!</Heading></Box>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
}

export default App;
