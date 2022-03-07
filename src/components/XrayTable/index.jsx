import { Box, DataTable, Text } from "grommet"

const XrayTable = (props) => {

  return (
    <Box align="center" justify="start" fill="horizontal" direction="column">
    <DataTable
      columns={[
        {
          header: <Text color="white" weight="bold">Surname</Text>, 
          property: "client_surname", 
        },
        {
          header: <Text color="white" weight="bold">First Name</Text>, 
          property: "client_forename"
        },
        {
          header: <Text color="white" weight="bold">Address</Text>,
          property: "client_address"
        },
        {
          header: <Text color="white" weight="bold">Phone Number</Text>,
          property: "client_phone"
        }
      ]}
      data={props.data} 
      pad="small"
      background={{
        "header":{"color":"brand"},
        "body":["white", "border"]
      }} 
      sortable
      resizeable 
      fill="horizontal"
      paginate
      step={10}
    />
    </Box>
  )
}

export default XrayTable