import { Box, Button } from 'grommet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

//components
import AddXrayModal from '../../components/AddXrayModal'
import XrayTable from '../../components/XrayTable'

/*
  props:
    (String) clinic_id: ID of the clinic the staff currently logged in is part of
    (String) staff_id: ID of the staff currently logged in
*/
const Xrays = ({ clinic_id, staff_id }) => {
  // Set state of xray modal (show/hide)
  const [showXrayModal, setShowXrayModal] = useState(false);
  // Set state of xrays for table
  const [xrays, setXrays] = useState([]);

  // Close the open xray modal
  const closeForms = () => {
    setShowXrayModal(false);
  }

  // Add a new xray to the state
  const addXrays = (newXray) => {
    // Change the date to a formatted string
    newXray.xray_date = new Date(newXray.xray_date).toLocaleDateString("en-US");
    
    setXrays([...xrays, newXray])
  }

  // Update an xray in the state
  const updateXrays = (newXray) => {
    // Find the index of the xray to update
    let index = xrays.findIndex(xray => xray.xray_id === newXray.xray_id);

    // Create a temp array to store the updated values
    let newXrays = xrays.slice();

    // Change the date to a formatted string
    newXray.xray_date = new Date(newXray.xray_date).toLocaleDateString("en-US");

    // Update the state
    newXrays[index] = newXray;
    setXrays(newXrays);
  }

   // Fetch xray data for table
   useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/xrays/clinic/${clinic_id}`;

      await axios.get(url, {
        headers: {
          'token': localStorage.token
      }}).then(res => {
        // Success: store xray data in state
        const xrays = res.data;

        // Format date to a string
        xrays.forEach(element => {
          element.xray_date = new Date(element.xray_date).toLocaleDateString("en-US");
        });
        setXrays(xrays)
      })
    }

    fetch_data();
  }, []);

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
          icon={<FontAwesomeIcon icon={faPlus} size='2x' />} 
          color="status-ok" 
          size="small"  
          margin={{"left":"medium"}} 
          onClick={() => setShowXrayModal(true)} 
          hoverIndicator 
          reverse 
          primary 
        />
      </Box>
      <XrayTable 
        data={xrays} 
        clinicId={clinic_id} 
        staffId={staff_id} 
        updateXray={updateXrays} 
      />
      { // Show add xray modal if selected
        showXrayModal && (
          <AddXrayModal
            closeForm={closeForms} 
            addXray={addXrays} 
            clinicId={clinic_id} 
            staffId={staff_id}
          />
      )}
    </Box>
  )
}

export default Xrays