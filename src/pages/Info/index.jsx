import { Box, Heading, NameValueList, NameValuePair, Text } from 'grommet';

/*
  props:
    (Object) userInfo: An object that holds the information of the logged in user
*/
const Info = ({ userInfo }) => {
  return (
    <Box align="start" justify="start" direction="column" fill="horizontal">
      <Heading level="2" textAlign="center" margin="small">
        System Information
      </Heading>
      <Box margin="medium">  
        <NameValueList>
          <NameValuePair name="Current User ID:">
            <Text color="text-strong">{userInfo.staff_member_id}</Text>
          </NameValuePair>
          <NameValuePair name="Current User Name:">
            <Text color="text-strong">{userInfo.staff_username}</Text>
          </NameValuePair>
          <NameValuePair name="Current User Role:">
            <Text color="text-strong">{userInfo.staff_role}</Text>
          </NameValuePair>
          <NameValuePair name="Clinic ID:">
            <Text color="text-strong">{userInfo.staff_clinic_id}</Text>
          </NameValuePair>
        </NameValueList>
      </Box>
    </Box>
  )
}

export default Info