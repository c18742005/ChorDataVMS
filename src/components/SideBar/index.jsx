import { Box, Button, Heading, Sidebar, Nav, Text } from 'grommet';
import { Items } from './items'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SideBar = ({ isAuth }) => {
  const [clinic, setClinic] = useState("");

  const retrieveSideBarInfo = async () => {
    try {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/sidebar`;

      await axios.get(url, {
        headers: {
          "token": localStorage.getItem("token")
        }
      })
      .then(res => {
        const data = res.data;
        setClinic(data.clinic_name)
      })
      .catch(err => console.log(err))
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    retrieveSideBarInfo();
  }, []);

  const linkStyle = {
    textDecoration: 'none', 
    color: 'black'
  }

  return (
      <>
        <Sidebar 
          align="stretch" 
          direction="column" 
          background={{"color":"brand"}} 
          justify="center" 
          fill="vertical"
          flex="shrink" 
        >
          <Heading level="3" textAlign="center" margin="small" color="white">
            {isAuth ? clinic : ""}
          </Heading>
          <Nav 
            align="stretch" 
            direction="column" 
            justify="start" 
            gap="none" 
            fill="horizontal"
          >
            { // Loop through the items in items.js and add them to the list
            Items.map((item, index) => (
              <Button key={item.title} fill="horizontal" hoverIndicator><Link to={item.path} style={linkStyle}>
              <Box 
                align="center" 
                justify="start" 
                direction="row" 
                pad="small" 
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
      </>
  )
}

export default SideBar