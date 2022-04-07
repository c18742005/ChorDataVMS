import { Box, Button, Heading, Sidebar, Nav, Text } from 'grommet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Data to be displayed in the sidebar
import { Items } from './items'

/*
  props:
    (Boolean) isAuth: True if user is authenticated otherwise false
*/
const SideBar = ({ isAuth }) => {
  // Set the state of the clinic
  const [clinic, setClinic] = useState("");

  useEffect(() => {
    // Function to retrieve the data on the server needed for the sidebar
    const retrieveSideBarInfo = async () => {
      try {
        const url = `${process.env.REACT_APP_API_END_POINT}/api/sidebar`;
  
        await axios.get(url, {
          headers: {
            "token": localStorage.getItem("token")
          }
        }).then(res => {
          // Success: set the clinic data
          const data = res.data;
          setClinic(data.clinic_name)
        }).catch(err => console.error(err));

      } catch(err) {
        console.error(err);
      }
    }

    retrieveSideBarInfo();
  }, []);

  // Function to style the sidebar links
  const linkStyle = {
    textDecoration: 'none',
    color: '#fff'
  }

  return (
    <Sidebar 
      data-testid="sideBar"
      align="stretch" 
      direction="column" 
      background={{"color":"brand"}} 
      pad='none'
      justify="center" 
      fill="vertical"
      overflow="auto"
      flex='shrink' 
    >
      <Heading 
        id='sideBarHeading'
        data-testid="sidebar-heading"
        level="3" 
        textAlign="center" 
        margin="small" 
        color="white"
      >
        {isAuth ? clinic : ""}
      </Heading>
      <Nav 
        align="stretch" 
        direction="column" 
        justify="start" 
        gap="none" 
        fill="horizontal"
      >
        { // Loop through the items in items.js and add them to the menu
        Items.map((item, index) => (
          <Button key={item.title} fill="horizontal" hoverIndicator><Link to={item.path} style={linkStyle}>
          <Box 
            align="center" 
            justify="start" 
            direction="row" 
            pad="small" 
            fill="horizontal"
            hoverIndicator
          >
            {item.icon}
            <Text color="white" textAlign="start" weight="normal" margin="small">
              {item.title}
            </Text>
          </Box>
          </Link>
        </Button>
        ))}
      </Nav>
    </Sidebar>
  )
}

export default SideBar