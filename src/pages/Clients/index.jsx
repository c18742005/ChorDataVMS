import { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, Button } from 'grommet'
import { UserAdd } from 'grommet-icons'

// Components
import ClientTable from '../../components/ClientTable'
import SearchBar from '../../components/SearchBar'
import AddClientForm from '../../components/AddClientForm'

const Clients = () => {
  const [showClientAdd, setShowClientAdd] = useState(false);
  const [clients, setClients] = useState([]);

  const closeForms = () => {
    setShowClientAdd(false);
  }

  // Fetch clients data
  useEffect(() => {
    const url = `${process.env.REACT_APP_API_END_POINT}/api/clients/`;

    axios.get(url)
      .then(res => {
        const clients = res.data;
        setClients(clients)
      })

  }, []);

  return (
    <Box align="center" justify="start" direction="column" pad="small">
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        pad="medium"
      >
        <SearchBar />
        <Button 
          label="Add User" 
          icon={<UserAdd />} 
          hoverIndicator 
          margin={{"left":"medium"}} 
          secondary 
          reverse 
          onClick={() => setShowClientAdd( true )} />
      </Box>
      <ClientTable data={ clients } />
      { // Show add client modal if necessary
        showClientAdd && (
          <AddClientForm closeForm={ closeForms } />
      )}
    </Box>
  )
}

export default Clients