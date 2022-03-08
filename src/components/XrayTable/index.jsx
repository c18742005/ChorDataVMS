import { Box, DataTable, Text } from "grommet"
import { useState } from "react"

// Components
import EditXrayModal from "../EditXrayModal";

const XrayTable = ({ data, clinicId, staffId, updateXray }) => {
  const [editModal, setEditModal] = useState(false);
  const [xray, setXray] = useState({});

  const closeForms = () => {
    setXray({});
    setEditModal(false);
  }

  return (
    <Box align="center" justify="start" fill="horizontal" direction="column">
      <DataTable
        columns={[{
            header: <Text color="white" weight="bold">Date</Text>, 
            property: "xray_date", 
          }, {
            header: <Text color="white" weight="bold">Patient</Text>, 
            property: "patient_name", 
          }, {
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
        background={{
          "header":{"color":"brand"},
          "body":["white", "border"]
        }} 
        sortable
        resizeable 
        fill="horizontal"
        onClickRow={({ datum }) => {
          setXray(datum);
          setEditModal(true);
        }}
        paginate
        step={10}
      />

      {
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