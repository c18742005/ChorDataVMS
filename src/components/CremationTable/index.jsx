import { Box, DataTable, Text } from "grommet"
import { useState } from "react"
import EditCremationModal from "../EditCremationModal";

/*
  props:
    (Object) data: Holds info about the cremation i.e. date collected, date returned, form
    (String) clinicId: ID of the clinic the cremation belongs to
    (Fn:Cremation) updateCremation: Function to update a cremation info in the cremation state
    (Fn:Cremation) deleteCremation: Function to delete a cremation from the cremation state
*/
const CremationTable = ({ data, clinicId, updateCremation, deleteCremation }) => {
  // Set state of cremation selected
  const [cremation, setCremation] = useState({});
  // Set state of modal (shown/hidden)
  const [editModal, setEditModal] = useState(false);

  // Function to handle form closure
  const closeForms = () => {
    setCremation({});
    setEditModal(false);
  }

  return (
    <Box align="center" justify="start" direction="column" fill>
      <DataTable
        columns={[ {
          header: <Text color="white" weight="bold">Patient</Text>, 
          property: "patient_name", 
          }, {
            header: <Text color="white" weight="bold">Microchip</Text>, 
            property: "patient_microchip", 
          }, {
            header: <Text color="white" weight="bold">Form</Text>, 
            property: "cremation_form", 
          }, {
            header: <Text color="white" weight="bold">Date Collected</Text>, 
            property: "cremation_date_collected_f", 
          }, {
            header: <Text color="white" weight="bold">Date Returned Practice</Text>, 
            property: "cremation_date_ashes_returned_practice_f", 
          }, {
            header: <Text color="white" weight="bold">Date Returned Owner</Text>, 
            property: "cremation_date_ashes_returned_owner_f", 
          }, {
            header: <Text color="white" weight="bold">Owner Contacted</Text>, 
            property: "cremation_owner_contacted", 
          }, 
        ]}
        data={data}
        background={{"header":{"color":"brand"}}} 
        border="horizontal"
        fill="horizontal"
        onClickRow={({ datum }) => {
          setCremation(datum);
          setEditModal(true)
        }}
        step={10}
        paginate
        sortable
        resizeable 
      />
      { // Show edit cremation modal if required
        editModal && (  
          <EditCremationModal
            closeForm={closeForms} 
            updateCremation={updateCremation} 
            deleteCremation={deleteCremation}
            clinicId={clinicId}
            data={cremation}
          />
        )
      }
    </Box>
  )
}

export default CremationTable