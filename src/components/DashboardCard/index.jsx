import { Box, Card, Heading } from "grommet"
import './style.css';

/*
  props:
    (String) title: Text to be shown on the card
    (FA icon) image: Icon to be shown on the card
*/
const DashboardCard = ({ title, image }) => {
  return (
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
  )
}

export default DashboardCard