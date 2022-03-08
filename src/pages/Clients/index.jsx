import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button } from 'grommet';
import { UserAdd } from 'grommet-icons';

// Components
import ClientTable from '../../components/ClientTable'
import SearchBar from '../../components/SearchBar'
import AddClientForm from '../../components/AddClientForm'

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
  }, []);

  return (
    <Box align="center" justify="start" direction="column" pad="small" fill="horizontal">
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        pad="medium"
      >
        <SearchBar />
        <Button 
          label="Add Client"
          icon={<UserAdd />} 
          color="status-ok" 
          size="small"  
          margin={{"left":"medium"}} 
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