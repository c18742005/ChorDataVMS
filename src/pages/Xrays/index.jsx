import { Box, Button } from 'grommet'
import { Add } from 'grommet-icons'
import { useState } from 'react'

//components
import AddXrayModal from '../../components/AddXrayModal'
import XrayTable from '../../components/XrayTable'


const Xrays = ({ clinic_id }) => {
  const [showXrayModal, setShowXrayModal] = useState(false);
  const [xrays, setXrays] = useState([]);

  const closeForms = () => {
    setShowXrayModal(false);
  }

  const updateXrays = (newXray) => {
    setXrays([...xrays, newXray])
  }

  return (
    <Box align="center" justify="start" direction="column" pad="small" fill="horizontal">
      <Box 
        align="center" 
        justify="end" 
        fill="horizontal" 
        direction="row" 
        pad="medium"
      >
        <Button 
          label="Add X-Ray"
          icon={<Add />} 
          reverse 
          primary 
          color="status-ok" 
          hoverIndicator 
          size="small"  
          margin={{"left":"medium"}} 
          onClick={() => setShowXrayModal(true)} 
        />
      </Box>
      <XrayTable data={ xrays } />
      { // Show add xray modal if necessary
        showXrayModal && (
          <AddXrayModal
            closeForm={closeForms} 
            addXray={updateXrays} 
            clinicId={clinic_id} 
          />
      )}
    </Box>
  )
}

export default Xrays