import { Box, DataTable, Text } from "grommet"
import { useState } from "react"

// Components
import EditXrayModal from "../EditXrayModal";

/*
  props:
    (Object) data: Holds info about the xray i.e. date, quality, kV, mAs
    (String) clinicId: ID of the clinic the Xray belongs to
    (String) staffId: ID of the staff editing the xray
    (Fn: Xrays) updateXray: Function to update an Xray info in the xray state
*/
const XrayTable = ({ data, clinicId, staffId, updateXray }) => {
  // Set state of modal (shown/hidden)
  const [editModal, setEditModal] = useState(false);
  // Set state of xray selected
  const [xray, setXray] = useState({});

  // Function to handle form closure
  const closeForms = () => {
    setXray({});
    setEditModal(false);
  }

  return (
    <Box align="center" justify="start" fill direction="column">
      <DataTable
        columns={[{
            header: <Text color="white" weight="bold">Date</Text>, 
            property: "xray_date_f", 
          }, {
            header: <Text color="white" weight="bold">Patient</Text>, 
            property: "patient_name", 
          }, {
            header: <Text color="white" weight="bold">Microchip</Text>, 
            property: "patient_microchip", 
          } ,{
            header: <Text color="white" weight="bold">Staff</Text>, 
            property: "staff_username", 
          }, {
            header: <Text color="white" weight="bold">Quality</Text>, 
            property: "xray_image_quality"
          }, {
            header: <Text color="white" weight="bold">kV</Text>,
            property: "xray_kv"
          }, {
            header: <Text color="white" weight="bold">mAs</Text>,
            property: "xray_mas"
          }, {
            header: <Text color="white" weight="bold">Position</Text>, 
            property: "xray_position", 
          }
        ]}
        data={data} 
        pad="small"
        background={{"header":{"color":"brand"}}} 
        border="horizontal"
        fill="horizontal"
        onClickRow={({ datum }) => {
          setXray(datum);
          setEditModal(true);
        }}
        step={10}
        paginate
        sortable
        resizeable 
      />

      { // Show edit xray modal if required
        editModal && (  
          <EditXrayModal
            closeForm={closeForms} 
            updateXray={updateXray} 
            clinicId={clinicId} 
            staffId={staffId}
            data={xray}
          />
        )
      }
    </Box>
  )
}

export default XrayTable