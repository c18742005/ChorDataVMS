import { Box, Grid } from 'grommet';
import { Aid, Alert, Close, Favorite, Group } from 'grommet-icons';
import DashboardCard from '../../components/DashboardCard';
import { Link } from 'react-router-dom';

const linkStyle = {
  textDecoration: 'none', 
  color: 'black'
}

const Dashboard = () => {

  return (
    <Box align="start" justify="start" direction="column" pad="medium" fill>
      <Grid fill="horizontal" gap="large" columns="medium" rows="medium">
      <Link to="/clients" style={linkStyle}>
        <DashboardCard title="Clients" image={<Group size="xlarge" color="black" />} />
      </Link>
      <Link to="/drugs" style={linkStyle}>
        <DashboardCard title="Drug Record" image={<Aid size="xlarge" color="black" />} />
      </Link>
      <Link to="/xrays" style={linkStyle}>
        <DashboardCard title="X-Ray Record" image={<Alert size="xlarge" color="black" />} />
      </Link>
      <Link to="/cremations" style={linkStyle}>
        <DashboardCard title="Cremations" image={<Close size="xlarge" color="black" />} />
      </Link>
      <Link to="/anaesthetic" style={linkStyle}>
        <DashboardCard title="Anaesthetic Monitoring" image={<Favorite size="xlarge" color="black" />} />
      </Link>
      </Grid>
    </Box>
  )
}

export default Dashboard