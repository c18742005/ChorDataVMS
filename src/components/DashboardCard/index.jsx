import { Box, Card, Heading } from "grommet"
import { useEffect, useState } from "react";
import './style.css';

/*
  props:
    (String) title: Text to be shown on the card
    (FA icon) image: Icon to be shown on the card
*/
const DashboardCard = ({ title, image }) => {
  const [mobileView, setMobileView] = useState(false);

  // Check width of screen
  useEffect(() => {
    window.innerWidth < 1025 ? setMobileView(true) : setMobileView(false)
  }, []);

  // Check width of screen
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1025 ? setMobileView(true) : setMobileView(false)
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  return (
    mobileView === false ? (
      <Card 
        direction="column" 
        justify="center" 
        align="center" 
        fill
        elevation="medium"
        className="dashboard-card">
        <Heading level="3" textAlign="center">
          {title}
        </Heading>
        <Box align="center" justify="center">
          {image}
        </Box>
      </Card>
    ) : (
      <Card 
        direction="column" 
        justify="center" 
        align="center" 
        elevation="medium"
        className="dashboard-card">
        <Heading level="3" textAlign="center">
          {title}
        </Heading>
        <Box align="center" justify="center">
          {image}
        </Box>
      </Card>
    )
  )
}

export default DashboardCard