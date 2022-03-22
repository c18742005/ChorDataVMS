import { Box, Button } from 'grommet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

//components
import AddCremationModal from '../../components/AddCremationModal'
import CremationTable from '../../components/CremationTable'

/*
  props:
    (String) clinic_id: ID of the clinic the staff currently logged in is part of
    (String) staff_id: ID of the staff currently logged in
*/
const Cremations = ({ clinic_id, staff_id }) => {
  // Set state of cremation modal (show/hide)
  const [showCremationModal, setShowCremationModal] = useState(false);
  // Set state of xrays for table
  const [cremations, setCremations] = useState([]);

  // Close the open cremation modal
  const closeForms = () => {
    setShowCremationModal(false);
  }

  // Add a new cremation to the state
  const addCremation = (newCremation) => {
    // Change the date to a formatted string
    newCremation.cremation_date = new Date(newCremation.cremation_date).toLocaleDateString("en-US");
    
    setCremations([...cremations, newCremation])
  }

  // Update a cremation in the state
  const updateCremations = (updatedCremation) => {
    // Find the index of the cremation to update
    let index = cremations.findIndex(crem => crem.cremation_id === updatedCremation.cremation_id);

    // Create a temp array to store the updated values
    let newCremations = cremations.slice();

    // Change the date to a formatted string
    updatedCremation.cremation_date = new Date(updatedCremation.cremation_date).toLocaleDateString("en-US");

    // Update the state
    newCremations[index] = updatedCremation;
    setCremations(newCremations);
  }

   // Fetch cremation data for table
   useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/cremations/clinic/${clinic_id}`;

      await axios.get(url, {
        headers: {
          'token': localStorage.token
      }}).then(res => {
        // Success: store cremation data in state
        const cremations = res.data;

        // Format date to a string
        cremations.forEach(element => {
          element.cremation_date = new Date(element.cremation_date).toLocaleDateString("en-US");
        });
        setCremations(cremations);
      })
    }

    fetch_data();
  }, []);

  return (
    <Box align="center" justify="start" direction="column" pad="small" fill>
      <Box 
        align="center" 
        justify="end" 
        fill="horizontal" 
        direction="row" 
        pad="medium"
      >
        <Button 
          label="Add Cremation"
          icon={<FontAwesomeIcon icon={faPlus} size='2x' />} 
          color="status-ok" 
          size="small"  
          margin={{"left":"medium"}} 
          onClick={() => setShowCremationModal(true)} 
          hoverIndicator 
          reverse 
          primary 
        />
      </Box>
      <CremationTable 
        data={cremations} 
        clinicId={clinic_id} 
        staffId={staff_id} 
        updateCremation={updateCremations} 
      />
      { // Show add cremation modal if selected
        showCremationModal && (
          <AddCremationModal
            closeForm={closeForms} 
            addCremation={addCremation} 
            clinicId={clinic_id} 
            staffId={staff_id}
          />
      )}
    </Box>
  )
}

export default Cremations