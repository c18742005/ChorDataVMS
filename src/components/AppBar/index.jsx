import { toast } from 'react-toastify';
import { Box, Button, Heading, Menu, Header } from 'grommet';
import { UserSettings, LinkPrevious, Menu as MenuIcon } from 'grommet-icons';

const AppBar = ( { setAuth, isAuth, menuOpen, handleMenu, user, setUser } ) => {
  const logout = () => {
    try {
      localStorage.clear();
      setUser({});
      setAuth(false);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err.message);
    }
  };
  
  return (
    <Box 
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
        { isAuth && (
          <Button icon={menuOpen ? 
            (<LinkPrevious color='white'/>) : 
            (<MenuIcon color='white'/>)} 
            hoverIndicator 
            onClick={handleMenu} 
          />
        )}
        <Heading level="1" color="white" textAlign="center" margin="small">
          ChorData
        </Heading>
        {isAuth && (
          <Menu 
            icon={<UserSettings color="white" />} 
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