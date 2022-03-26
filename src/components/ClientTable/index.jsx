import { useNavigate } from 'react-router-dom';
import { Box, DataTable, Text } from 'grommet';

/*
  props:
    (array) data: Array of clients and their information to be displayed
*/
const ClientTable = ({ data }) => {
  let navigate = useNavigate();

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
      data={data} 
      pad="small"
      background={{
        "header":{"color":"brand"}
      }} 
      border="horizontal"
      sortable
      resizeable 
      fill="horizontal"
      paginate
      step={10}
      onClickRow={({ datum }) => {navigate(`/client/${datum.client_id}`)}}
    />
    </Box>
  )
}

export default ClientTable