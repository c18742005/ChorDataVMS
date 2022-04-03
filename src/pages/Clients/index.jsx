import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Heading } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

// Components
import ClientTable from '../../components/ClientTable'
import AddClientForm from '../../components/AddClientForm'

/*
  props:
    (String) clinic: ID of the clinic to retrieve clients from
*/
const Clients = ({ clinic }) => {
  // Set state of client add modal )open/close) and clients state
  const [showClientAdd, setShowClientAdd] = useState(false);
  const [clients, setClients] = useState([]);

  // Function to close add client modal
  const closeForms = () => {
    setShowClientAdd(false);
  }

  // Function to update clients data
  const updateClients = (newClient) => {
    setClients([...clients, newClient])
  }

  // Fetch clients data from server
  useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/clients/clinic/${clinic}`;

      await axios.get(url, {
        headers: {
          'token': localStorage.token
      }}).then(res => {
        // Success: set client state to show new client
        const clients = res.data;
        setClients(clients)
      })
    }

    fetch_data();
  }, [clinic]);

  return (
    <Box align="start" justify="start" direction="column" fill="horizontal" gap="small">
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        gap="small"
        pad="small"
      >
        <Heading level="2" pad="none" margin="none" gap="none">Clients</Heading>
        <Button 
          label="Add Client"
          icon={<FontAwesomeIcon icon={faUserPlus} size='2x' />} 
          color="status-ok" 
          size="small"  
          onClick={() => setShowClientAdd(true)} 
          hoverIndicator 
          reverse 
          primary 
        />
      </Box>
      <ClientTable data={ clients } />
      { // Show add client modal if necessary
        showClientAdd && (
          <AddClientForm 
            closeForm={closeForms} 
            addClient={updateClients} 
            clinic={clinic} 
          />
      )}
    </Box>
  )
}

export default Clients 