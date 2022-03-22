import { Box, DataTable, Text } from "grommet"
import { useState } from "react"

/*
  props:
    (Object) data: Holds info about the cremation i.e. date collected, date returned, form
    (String) clinicId: ID of the clinic the cremation belongs to
    (Fn:Cremation) updateCremation: Function to update a cremation info in the cremation state
*/
const CremationTable = ({ data, clinicId, staffId, updateCremation }) => {
  // Set state of cremation selected
  const [cremation, setCremation] = useState({});

  return (
    <Box align="center" justify="start" fill direction="column">
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
            property: "cremation_date_collected", 
          }, {
            header: <Text color="white" weight="bold">Date Returned</Text>, 
            property: "cremation_date_ashes_returned", 
          }, {
            header: <Text color="white" weight="bold">Owner Contacted</Text>, 
            property: "cremation_owner_contacted", 
          }, 
        ]}
        data={data} 
        pad="small"
        background={{
          "header":{"color":"brand"},
          "body":["white", "border"]
        }} 
        fill="horizontal"
        onClickRow={({ datum }) => {
          setCremation(datum);
        }}
        step={10}
        paginate
        sortable
        resizeable 
      />
    </Box>
  )
}

export default CremationTable