import { Navigate, Routes, Route } from "react-router-dom";
import axios from 'axios';
import { Box, Grommet, Heading } from 'grommet';
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import theme from './theme'

// CSS for toast containers
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import SideBar from "./components/SideBar";
import AppBar from "./components/AppBar";
import Client from "./pages/Client";
import Patient from "./pages/Patient";
import Drugs from "./pages/Drugs";
import Xrays from "./pages/Xrays";
import Dentals from "./pages/Dentals";
import Cremations from "./pages/Cremations";
import Info from "./pages/Info";
import Anaesthetic from "./pages/Anaesthetic";
import AnaestheticSheet from "./pages/AnaestheticSheet";

function App() {
  const [menuOpen, setMenuOpen] = useState(true); // Set state of the sidebar
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set state for user logging in
  const [user, setUser] = useState({}); // Set user details

  // Function to handle toggling the sidebar open and close
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
          // If response contains token then set auth to true
          const parseRes = res.data;
          parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        })
        .catch(e => console.log(e.response.data))
    } catch (err) {
      console.error(err.message);
    }
  };

  // Retrieve staff user info from backend
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

  // Authenticate the user and retrieve their details
  useEffect(() => {
    checkAuthenticated();
    retrieveUser();
  }, [isAuthenticated]);

  // Function to set the authentication status of a user
  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <Grommet theme={theme} full>
      <ToastContainer />
      <Box fill 
        align="stretch" 
        direction="row" 
        justify="stretch" 
        gap="none"
        flex="grow"
      >
        { // Load sidebar if user is authenticated
         isAuthenticated && (
          menuOpen && (
          <SideBar isAuth={isAuthenticated} />
        ))}
        
        <Box align="center" justify="start" direction="column" fill>
          <Box 
            align="center" 
            justify="start" 
            direction="column" 
            gap="none" 
            fill
          >
            <AppBar 
              handleMenu={handleMenu} 
              menuOpen={menuOpen} 
              setAuth={setAuth} 
              isAuth={isAuthenticated}
              user={user.staff_username}
              setUser={setUser}
            />
            <Box align="start" justify="start" direction="column" pad="medium" overflow="auto" fill>
              <Routes>
                <Route path="/login" element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Login setAuth={setAuth} />
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
                <Route path="/xrays" element={
                  isAuthenticated ? (
                    <Xrays
                      clinic_id={user.staff_clinic_id} 
                      staff_id={user.staff_member_id}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="/dentals" element={
                  isAuthenticated ? (
                    <Dentals 
                      clinic_id={user.staff_clinic_id} 
                      staff_id={user.staff_member_id}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="/cremations" element={
                  isAuthenticated ? (
                    <Cremations
                      clinic_id={user.staff_clinic_id} 
                      staff_id={user.staff_member_id}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="/anaesthetic" element={
                  isAuthenticated ? (
                    <Anaesthetic
                      clinic_id={user.staff_clinic_id} 
                      staff_id={user.staff_member_id}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route path="/anaesthetic/:anaestheticId" element={
                  isAuthenticated ? (
                    <AnaestheticSheet />
                  ) : (
                    <Navigate to="/login" />
                  )}
                />
                <Route path="/info" element={
                  isAuthenticated ? (
                    <Info
                      userInfo={user}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )} 
                />
                <Route 
                  path="*" 
                  element={
                    <Box><Heading level={3}>404: Feature Coming Soon</Heading></Box>
                  } 
                />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
}

export default App;
