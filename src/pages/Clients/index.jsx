import { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, Button } from 'grommet'
import { UserAdd } from 'grommet-icons'

// Components
import ClientTable from '../../components/ClientTable'
import SearchBar from '../../components/SearchBar'
import AddClientForm from '../../components/AddClientForm'

const Clients = ({ clinic }) => {
  const [showClientAdd, setShowClientAdd] = useState(false);
  const [clients, setClients] = useState([]);

  const closeForms = () => {
    setShowClientAdd(false);
  }

  const updateClients = (newClient) => {
    setClients([...clients, newClient])
  }

  // Fetch clients data
  useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/clients/clinic/${clinic}`;

      await axios.get(url)
      .then(res => {
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
          reverse 
          primary 
          color="status-ok" 
          hoverIndicator 
          size="small"  
          margin={{"left":"medium"}} 
          onClick={() => setShowClientAdd(true)} 
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