import { Box, Button, Form, FormField, Heading, Layer, Select, TextInput } from "grommet"

const EditClientModal = (props) => {
  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Edit Client</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form>
          <FormField required>
            <TextInput placeholder="First Name" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Surname" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Home Address" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <Select options={["Tipperary","Wicklow"]} closeOnChange placeholder="County" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Phone Number" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Email" size="medium" type="text" plain />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Edit" primary hoverIndicator />
            <Button label="Cancel" primary hoverIndicator color="accent-4" onClick={props.closeForm}/>
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default EditClientModal