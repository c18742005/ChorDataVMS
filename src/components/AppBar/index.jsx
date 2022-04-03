import { toast } from 'react-toastify';
import { Box, Button, Heading, Menu, Header } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faUserGear } from '@fortawesome/free-solid-svg-icons';

/*
  props:
    (Boolean): isAuth: If the user is authenticated
    (Boolean): menuOpen: If the menu is open/closed
    (Obj) user: Object that holds user info i.e. id, role, username
    (Fn: App): setAuth: Function to set isAuth state to true/false
    (Fn: App) handleMenu: Function to set menuOpen state to true/false
    (Fn: App) setUser: Function to change user state
*/
const AppBar = ( { setAuth, isAuth, menuOpen, handleMenu, user, setUser } ) => {
  // function to handle a user logging out of the app
  const logout = () => {
    try {
      localStorage.clear(); // Remove token from local storage
      setUser({});          // Set user state to empty object
      setAuth(false);       // Set auth to false
      toast.success("Logged out successfully");
    } catch (err) {
      // Display error with logging out
      console.error(err.message);
    }
  };
  
  return (
    <Box 
      data-testid="appBar"
      align="center" 
      justify="center" 
      direction="row" 
      gap="none" 
      fill="horizontal"
    >
      <Header 
        align="center" 
        direction="row" 
        justify={isAuth ? "between" : "center"}
        gap="none" 
        background={{"color":"brand"}} 
        fill="horizontal" 
        pad={{"horizontal":"xsmall"}}
      >
        { // Display button if user is authenticated
        isAuth && (
          <Button icon={menuOpen ? 
            (<FontAwesomeIcon icon={faArrowLeft} style={{color: "#FFF"}} size='lg' data-testid="button-1"/>) : 
            (<FontAwesomeIcon icon={faBars} style={{color: "#FFF"}} size='lg' data-testid="button-2"/>)} 
            name="appbar-button"
            hoverIndicator 
            onClick={handleMenu} 
            data-testid="appbar-button"
          />
        )}
        <Heading 
          level="1" 
          color="white" 
          textAlign="center" 
          margin="small"
        >
          ChorData
        </Heading>
        { // Display menu if user is authenticated
        isAuth && (
          <Menu 
            data-testid="appbar-menu"
            icon={<FontAwesomeIcon icon={faUserGear} style={{color: "#FFF"}} size='lg' />} 
            items={[
              {"label": "Current User: " + user},
              {"label":"Logout", onClick: () => logout()}]
            }
          />)
        }
      </Header>
    </Box>
  )
}

export default AppBar