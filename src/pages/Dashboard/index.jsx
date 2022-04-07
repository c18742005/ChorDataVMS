import { Box } from 'grommet';
import DashboardCard from '../../components/DashboardCard';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCross,
  faHeartPulse,
  faPills, 
  faRadiation, 
  faTooth, 
  faUsers } from '@fortawesome/free-solid-svg-icons';

// Function to style links
const linkStyle = {
  textDecoration: 'none', 
  color: 'black',
  width: "100%",
  height: "100%"
}

const Dashboard = () => {

  return (
    <Box align="start" justify="center" direction="row" gap="medium" fill>
      <Box align="center" justify="center" fill gap="medium">
      <Link to="/clients" style={linkStyle}>
          <DashboardCard 
            title="Clients" 
            image={<FontAwesomeIcon icon={faUsers} size='6x'/>} 
          />
        </Link>
        <Link to="/dentals" style={linkStyle}>
          <DashboardCard 
            title="Dental Record" 
            image={<FontAwesomeIcon icon={faTooth} size='6x' />} 
          />
        </Link>
      </Box>
      <Box align="center" justify="center" fill gap="medium">
        <Link to="/anaesthetic" style={linkStyle}>
          <DashboardCard 
            title="Anaesthetic Monitoring" 
            image={<FontAwesomeIcon icon={faHeartPulse} size='6x' />} 
          />
        </Link>
        <Link to="/drugs" style={linkStyle}>
          <DashboardCard 
            title="Drug Record" 
            image={<FontAwesomeIcon icon={faPills} size='6x' />} 
          />
        </Link>
      </Box>
      <Box align="center" justify="center" fill gap="medium">
        <Link to="/cremations" style={linkStyle}>
          <DashboardCard 
             title="Cremations" 
             image={<FontAwesomeIcon icon={faCross} size='6x' />} 
          />
        </Link>
        <Link to="/xrays" style={linkStyle}>
          <DashboardCard 
            title="X-Ray Exposure" 
            image={<FontAwesomeIcon icon={faRadiation} size='6x' />} 
          />
        </Link>
      </Box>
    </Box>
  )
}

export default Dashboard