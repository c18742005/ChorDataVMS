import { Box, Button, Heading } from 'grommet';
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
const Cremations = ({ clinic_id }) => {
  // Set state of cremation modal (show/hide)
  const [showCremationModal, setShowCremationModal] = useState(false);
  // Set state of xrays for table
  const [cremations, setCremations] = useState([]);

  // Close the open cremation modal
  const closeForms = () => {
    setShowCremationModal(false);
  }

  const formatOutput = (crem) => {
    if(crem.cremation_date_collected !== null) {
      crem.cremation_date_collected_f =
        new Date(crem.cremation_date_collected).toLocaleDateString("en-IE");
    }
    if(crem.cremation_date_ashes_returned_practice !== null) {
      crem.cremation_date_ashes_returned_practice_f = 
        new Date(crem.cremation_date_ashes_returned_practice).toLocaleDateString("en-IE");
    }
    if(crem.cremation_date_ashes_returned_owner !== null) {
      crem.cremation_date_ashes_returned_owner_f = 
      new Date(crem.cremation_date_ashes_returned_owner).toLocaleDateString("en-IE");
    }
    if(crem.cremation_owner_contacted === true) {
      crem.cremation_owner_contacted = 'Yes';
    } else {
      crem.cremation_owner_contacted = 'No';
    }

    return crem;
  }

  // Add a new cremation to the state
  const addCremation = (newCremation) => {
    // Change the date to a formatted string
    // Change dates and Booleans to a formatted string
    newCremation = formatOutput(newCremation);

    setCremations([...cremations, newCremation])
  }

  // Update a cremation in the state
  const updateCremations = (updatedCremation) => {
    // Find the index of the cremation to update
    let index = cremations.findIndex(crem => crem.cremation_id === updatedCremation.cremation_id);

    // Create a temp array to store the updated values
    let newCremations = cremations.slice();

    // Change dates and Booleans to a formatted string
    updatedCremation = formatOutput(updatedCremation);

    // Update the state
    newCremations[index] = updatedCremation;
    setCremations(newCremations);
  }

  // Delete a cremation in the state
  const deleteCremation = (cremationId) => {
    const newCremations = cremations.filter(cremation => cremation.cremation_id !== cremationId)

    // Update the state
    setCremations(newCremations);
  }

   // Fetch cremation data for table
   useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/cremations/clinic/${clinic_id}`;

      // Attempt to get cremations from server
      try {
        await axios.get(url, {
          headers: {
            'token': localStorage.token
        }}).then(res => {
          // Success: store cremation data in state
          const cremations = res.data;
  
          // Format dates and Booleans to a string
          cremations.forEach(element => {
            element = formatOutput(element);
          });
  
          setCremations(cremations);
        })
      } catch(error) {
        console.error(error.message);
      }
    }

    fetch_data();
  }, [clinic_id]);

  return (
    <Box align="start" justify="start" direction="column" pad="small" fill>
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        gap="small"
        pad="small"
      >
        <Heading level="2" pad="none" margin="none" gap="none">Cremation Tracker</Heading>
        <Button 
          label="Add Cremation"
          icon={<FontAwesomeIcon icon={faPlus} size='2x' />} 
          color="status-ok" 
          size="small"  
          onClick={() => setShowCremationModal(true)} 
          hoverIndicator 
          reverse 
          primary 
        />
      </Box>
      <CremationTable 
        data={cremations} 
        clinicId={clinic_id} 
        updateCremation={updateCremations} 
        deleteCremation={deleteCremation}
      />
      { // Show add cremation modal if selected
        showCremationModal && (
          <AddCremationModal
            closeForm={closeForms} 
            addCremation={addCremation} 
            clinicId={clinic_id}
          />
      )}
    </Box>
  )
}

export default Cremations